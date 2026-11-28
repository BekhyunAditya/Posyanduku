<?php

namespace App\Http\Controllers\Ortu;

use App\Http\Controllers\Controller;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', PosyanduSchedule::class);

        $user = $request->user();
        $children = $user->children()->active()->get(['id', 'name', 'nickname', 'posyandu_id']);
        $posyanduIds = $children->pluck('posyandu_id')
            ->push($user->posyandu_id)
            ->filter()
            ->unique()
            ->values();

        $month = $request->string('month')->trim()->toString();

        $schedules = $posyanduIds->isNotEmpty()
            ? PosyanduSchedule::query()
                ->published()
                ->with('posyandu:id,name,address')
                ->whereIn('posyandu_id', $posyanduIds)
                ->when(
                    preg_match('/^\d{4}-\d{2}$/', $month) === 1,
                    fn ($query) => $query->whereYear('scheduled_date', substr($month, 0, 4))
                        ->whereMonth('scheduled_date', substr($month, 5, 2))
                )
                ->orderBy('scheduled_date')
                ->orderBy('start_time')
                ->get()
            : collect();

        $upcomingSchedules = $posyanduIds->isNotEmpty()
            ? PosyanduSchedule::query()
                ->published()
                ->upcoming()
                ->with('posyandu:id,name,address')
                ->whereIn('posyandu_id', $posyanduIds)
                ->limit(6)
                ->get()
            : collect();

        $openFollowUps = $children->isNotEmpty()
            ? PosyanduVisit::query()
                ->openFollowUp()
                ->with(['child:id,name,nickname', 'kader:id,name', 'schedule:id,title,scheduled_date'])
                ->whereIn('child_id', $children->pluck('id'))
                ->orderByDesc('visited_at')
                ->get()
            : collect();

        return Inertia::render('OrangTua/KalenderPosyandu', [
            'schedules' => $schedules,
            'upcomingSchedules' => $upcomingSchedules,
            'nextSchedule' => $upcomingSchedules->first(),
            'openFollowUps' => $openFollowUps,
            'filters' => [
                'month' => $month !== '' ? $month : now()->format('Y-m'),
            ],
        ]);
    }
}
