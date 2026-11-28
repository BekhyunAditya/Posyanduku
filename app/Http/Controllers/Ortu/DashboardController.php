<?php

namespace App\Http\Controllers\Ortu;

use App\Http\Controllers\Controller;
use App\Models\ChecklistTemplate;
use App\Models\Child;
use App\Models\ChildChecklistProgress;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use App\Services\GrowthChartService;
use App\Services\ImmunizationTrackerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly GrowthChartService $growthChartService,
        private readonly ImmunizationTrackerService $immunizationTrackerService,
    ) {}

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $children = $user->children()
            ->active()
            ->with('posyandu:id,name,address')
            ->withCount('visits')
            ->orderBy('name')
            ->get();

        $requestedChildId = $request->integer('child_id') ?: null;
        $selectedChild = $requestedChildId !== null
            ? $children->firstWhere('id', $requestedChildId)
            : $children->first();

        if ($selectedChild === null && $children->isNotEmpty()) {
            $selectedChild = $children->first();
        }

        $posyanduId = $selectedChild?->posyandu_id ?? $user->posyandu_id;
        $upcomingSchedules = $posyanduId !== null
            ? PosyanduSchedule::query()
                ->published()
                ->upcoming()
                ->with('posyandu:id,name,address')
                ->where('posyandu_id', $posyanduId)
                ->limit(3)
                ->get()
            : collect();

        $nextSchedule = $upcomingSchedules->first();

        $growthPayload = $selectedChild !== null
            ? $this->growthChartService->buildChartPayload($selectedChild)
            : null;

        $immunizationPayload = $selectedChild !== null
            ? $this->immunizationTrackerService->buildSummaryForChild($selectedChild)
            : null;

        $totalChecklistSteps = ChecklistTemplate::query()->activeOrdered()->count();
        $completedChecklistSteps = $selectedChild !== null
            ? ChildChecklistProgress::query()
                ->where('child_id', $selectedChild->id)
                ->where('user_id', $user->id)
                ->where('is_completed', true)
                ->when(
                    $nextSchedule !== null,
                    fn ($query) => $query->where('posyandu_schedule_id', $nextSchedule->id),
                    fn ($query) => $query->whereNull('posyandu_schedule_id')
                )
                ->count()
            : 0;

        $openFollowUps = $selectedChild !== null
            ? PosyanduVisit::query()
                ->openFollowUp()
                ->with(['kader:id,name', 'schedule:id,title,scheduled_date'])
                ->where('child_id', $selectedChild->id)
                ->orderByDesc('visited_at')
                ->limit(3)
                ->get()
            : collect();

        $notifications = $user->notifications()
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($notification): array => [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'read_at' => $notification->read_at?->toIso8601String(),
                'created_at' => $notification->created_at?->toIso8601String(),
            ])
            ->all();

        return Inertia::render('OrangTua/DashboardOrtu', [
            'children' => $children->map(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
                'gender' => $child->gender->value,
                'gender_label' => $child->gender->label(),
                'posyandu' => $child->posyandu?->only(['id', 'name', 'address']),
                'visits_count' => $child->visits_count,
            ])->values()->all(),
            'selectedChildId' => $selectedChild?->id,
            'selectedChild' => $selectedChild !== null ? [
                'id' => $selectedChild->id,
                'name' => $selectedChild->name,
                'nickname' => $selectedChild->nickname,
                'birth_date' => $selectedChild->birth_date->toDateString(),
                'age_months' => $selectedChild->ageInMonths(),
                'age_label' => $selectedChild->ageLabel(),
                'gender' => $selectedChild->gender->value,
                'gender_label' => $selectedChild->gender->label(),
                'posyandu' => $selectedChild->posyandu?->only(['id', 'name', 'address']),
                'visits_count' => $selectedChild->visits_count,
            ] : null,
            'latestMeasurement' => $growthPayload !== null ? ($growthPayload['history'][0] ?? null) : null,
            'growthSummary' => $growthPayload !== null ? [
                'comparison' => $growthPayload['comparison'],
                'recent_points' => array_slice($growthPayload['points'], -6),
                'disclaimer' => $growthPayload['disclaimer'],
            ] : null,
            'nextImmunization' => $immunizationPayload['next_immunization'] ?? null,
            'immunizationSummary' => $immunizationPayload['summary'] ?? null,
            'nextSchedule' => $nextSchedule,
            'upcomingSchedules' => $upcomingSchedules,
            'checklistProgress' => [
                'completed' => $completedChecklistSteps,
                'total' => $totalChecklistSteps,
                'label' => "{$completedChecklistSteps}/{$totalChecklistSteps} langkah selesai",
            ],
            'openFollowUps' => $openFollowUps,
            'notifications' => $notifications,
            'unreadNotificationsCount' => $user->unreadNotifications()->count(),
        ]);
    }
}
