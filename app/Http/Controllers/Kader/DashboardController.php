<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\GrowthMeasurement;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $kader = $request->user()->load('posyandu:id,name,code,address,routine_schedule');
        $posyanduId = $kader->posyandu_id;
        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();

        $totalChildren = Child::query()
            ->active()
            ->where('posyandu_id', $posyanduId)
            ->count();

        $measuredThisMonth = GrowthMeasurement::query()
            ->whereBetween('measured_at', [$monthStart, $monthEnd])
            ->whereHas('child', fn ($query) => $query->active()->where('posyandu_id', $posyanduId))
            ->distinct('child_id')
            ->count('child_id');

        $visitsThisMonth = PosyanduVisit::query()
            ->whereBetween('visited_at', [$monthStart, $monthEnd])
            ->where('attendance_status', 'hadir')
            ->whereHas('child', fn ($query) => $query->where('posyandu_id', $posyanduId))
            ->count();

        $openFollowUpsQuery = PosyanduVisit::query()
            ->openFollowUp()
            ->whereHas('child', fn ($query) => $query->where('posyandu_id', $posyanduId));

        $openFollowUpsCount = (clone $openFollowUpsQuery)->count();

        $openFollowUps = (clone $openFollowUpsQuery)
            ->with(['child:id,name,nickname,parent_id', 'child.parent:id,name,phone'])
            ->orderByDesc('visited_at')
            ->limit(5)
            ->get();

        $upcomingSchedules = PosyanduSchedule::query()
            ->upcoming()
            ->where('posyandu_id', $posyanduId)
            ->limit(4)
            ->get();

        $recentVisits = PosyanduVisit::query()
            ->with(['child:id,name,nickname', 'schedule:id,title'])
            ->whereHas('child', fn ($query) => $query->where('posyandu_id', $posyanduId))
            ->orderByDesc('visited_at')
            ->limit(5)
            ->get();

        $recentChildren = Child::query()
            ->active()
            ->with(['parent:id,name', 'latestMeasurement'])
            ->where('posyandu_id', $posyanduId)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
                'gender' => $child->gender->value,
                'parent_name' => $child->parent?->name,
                'latest_measurement' => $child->latestMeasurement,
            ])
            ->all();

        return Inertia::render('Kader/DashboardKader', [
            'posyandu' => $kader->posyandu?->only(['id', 'name', 'code', 'address', 'routine_schedule']),
            'summary' => [
                'total_children' => $totalChildren,
                'measured_this_month' => $measuredThisMonth,
                'visits_this_month' => $visitsThisMonth,
                'open_follow_ups_count' => $openFollowUpsCount,
            ],
            'nextSchedule' => $upcomingSchedules->first(),
            'upcomingSchedules' => $upcomingSchedules,
            'openFollowUps' => $openFollowUps,
            'recentVisits' => $recentVisits,
            'recentChildren' => $recentChildren,
        ]);
    }
}
