<?php

namespace App\Http\Controllers\Ortu;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ortu\ToggleChecklistRequest;
use App\Models\ChecklistTemplate;
use App\Models\Child;
use App\Models\ChildChecklistProgress;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class VisitGuideController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Child::class);

        $user = $request->user();
        $children = $user->children()
            ->active()
            ->with('posyandu:id,name')
            ->orderBy('name')
            ->get();

        $requestedChildId = $request->integer('child_id') ?: null;
        $selectedChild = $requestedChildId !== null
            ? $children->firstWhere('id', $requestedChildId)
            : $children->first();

        if ($selectedChild === null && $children->isNotEmpty()) {
            $selectedChild = $children->first();
        }

        $upcomingSchedules = collect();
        $selectedSchedule = null;

        if ($selectedChild !== null && $selectedChild->posyandu_id !== null) {
            $upcomingSchedules = PosyanduSchedule::query()
                ->published()
                ->upcoming()
                ->where('posyandu_id', $selectedChild->posyandu_id)
                ->limit(5)
                ->get();

            $requestedScheduleId = $request->integer('schedule_id') ?: null;
            $selectedSchedule = $requestedScheduleId !== null
                ? $upcomingSchedules->firstWhere('id', $requestedScheduleId)
                : $upcomingSchedules->first();

            if ($selectedSchedule === null) {
                $selectedSchedule = $upcomingSchedules->first();
            }
        }

        $templates = ChecklistTemplate::query()->activeOrdered()->get();
        $progressByTemplate = collect();

        if ($selectedChild !== null) {
            $progressByTemplate = ChildChecklistProgress::query()
                ->where('child_id', $selectedChild->id)
                ->where('user_id', $user->id)
                ->when(
                    $selectedSchedule !== null,
                    fn ($query) => $query->where('posyandu_schedule_id', $selectedSchedule->id),
                    fn ($query) => $query->whereNull('posyandu_schedule_id')
                )
                ->get()
                ->keyBy('checklist_template_id');
        }

        $checklist = $templates->map(function (ChecklistTemplate $template) use ($progressByTemplate): array {
            /** @var ChildChecklistProgress|null $record */
            $record = $progressByTemplate->get($template->id);

            return [
                'id' => $template->id,
                'phase' => $template->phase,
                'title' => $template->title,
                'description' => $template->description,
                'sort_order' => $template->sort_order,
                'is_completed' => (bool) ($record?->is_completed ?? false),
                'completed_at' => $record?->completed_at?->toIso8601String(),
            ];
        })->values();

        $totalSteps = $checklist->count();
        $completedSteps = $checklist->where('is_completed', true)->count();

        $followUps = $selectedChild !== null
            ? PosyanduVisit::query()
                ->where('child_id', $selectedChild->id)
                ->where('needs_follow_up', true)
                ->with(['kader:id,name', 'schedule:id,title,scheduled_date'])
                ->orderByDesc('visited_at')
                ->limit(5)
                ->get()
            : collect();

        return Inertia::render('OrangTua/PanduanKunjungan', [
            'children' => $children->map(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
                'posyandu' => $child->posyandu?->only(['id', 'name']),
            ])->values()->all(),
            'selectedChildId' => $selectedChild?->id,
            'upcomingSchedules' => $upcomingSchedules,
            'selectedSchedule' => $selectedSchedule,
            'checklist' => $checklist->all(),
            'groupedGuide' => [
                'sebelum' => $checklist->where('phase', 'sebelum')->values()->all(),
                'saat' => $checklist->where('phase', 'saat')->values()->all(),
                'sesudah' => $checklist->where('phase', 'sesudah')->values()->all(),
            ],
            'progress' => [
                'completed' => $completedSteps,
                'total' => $totalSteps,
                'label' => "{$completedSteps}/{$totalSteps} langkah selesai",
                'percentage' => $totalSteps > 0 ? (int) round(($completedSteps / $totalSteps) * 100) : 0,
            ],
            'followUps' => $followUps,
        ]);
    }

    public function toggleChecklist(ToggleChecklistRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $isCompleted = (bool) $validated['is_completed'];

        ChildChecklistProgress::query()->updateOrCreate(
            [
                'child_id' => $validated['child_id'],
                'posyandu_schedule_id' => $validated['posyandu_schedule_id'] ?? null,
                'checklist_template_id' => $validated['checklist_template_id'],
            ],
            [
                'user_id' => $request->user()->id,
                'is_completed' => $isCompleted,
                'completed_at' => $isCompleted ? now() : null,
            ]
        );

        return redirect()->route('ortu.visit-guide.index', array_filter([
            'child_id' => $validated['child_id'],
            'schedule_id' => $validated['posyandu_schedule_id'] ?? null,
        ]))->with('status', 'Progres checklist kesiapan posyandu berhasil diperbarui.');
    }
}
