<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kader\StorePosyanduVisitRequest;
use App\Http\Requests\Kader\UpdatePosyanduVisitRequest;
use App\Models\Child;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class VisitController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', PosyanduVisit::class);

        $kader = $request->user();
        $scheduleId = $request->integer('posyandu_schedule_id') ?: null;
        $attendance = $request->string('attendance_status')->toString();

        $visits = PosyanduVisit::query()
            ->with([
                'child:id,name,nickname,birth_date,gender',
                'schedule:id,title,scheduled_date',
                'kader:id,name',
            ])
            ->whereHas('child', fn ($query) => $query->where('posyandu_id', $kader->posyandu_id))
            ->when($scheduleId !== null, fn ($query) => $query->where('posyandu_schedule_id', $scheduleId))
            ->when($attendance !== '', fn ($query) => $query->where('attendance_status', $attendance))
            ->orderByDesc('visited_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        $schedules = PosyanduSchedule::query()
            ->where('posyandu_id', $kader->posyandu_id)
            ->orderByDesc('scheduled_date')
            ->limit(12)
            ->get(['id', 'title', 'scheduled_date']);

        return Inertia::render('Kader/DataBalita', [
            'visits' => $visits,
            'schedules' => $schedules,
            'filters' => [
                'posyandu_schedule_id' => $scheduleId,
                'attendance_status' => $attendance,
            ],
        ]);
    }

    public function followUps(Request $request): Response
    {
        Gate::authorize('viewAny', PosyanduVisit::class);

        $kader = $request->user();
        $status = $request->string('status')->toString();

        $baseQuery = PosyanduVisit::query()
            ->where('needs_follow_up', true)
            ->whereHas('child', fn ($query) => $query->where('posyandu_id', $kader->posyandu_id));

        $followUps = (clone $baseQuery)
            ->with([
                'child:id,name,nickname,birth_date,parent_id',
                'child.parent:id,name,phone',
                'schedule:id,title,scheduled_date',
                'kader:id,name',
            ])
            ->when($status === 'open', fn ($query) => $query->whereNull('follow_up_resolved_at'))
            ->when($status === 'resolved', fn ($query) => $query->whereNotNull('follow_up_resolved_at'))
            ->orderByDesc('visited_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Kader/DataBalita', [
            'followUps' => $followUps,
            'summary' => [
                'open_count' => (clone $baseQuery)->whereNull('follow_up_resolved_at')->count(),
                'resolved_count' => (clone $baseQuery)->whereNotNull('follow_up_resolved_at')->count(),
            ],
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function store(StorePosyanduVisitRequest $request, Child $child): RedirectResponse
    {
        $validated = $request->validated();
        $needsFollowUp = (bool) ($validated['needs_follow_up'] ?? false);

        $child->visits()->create([
            'posyandu_schedule_id' => $validated['posyandu_schedule_id'] ?? null,
            'kader_id' => $request->user()->id,
            'visited_at' => $validated['visited_at'],
            'attendance_status' => $validated['attendance_status'],
            'services_provided' => $validated['services_provided'] ?? [],
            'service_notes' => $validated['service_notes'] ?? null,
            'needs_follow_up' => $needsFollowUp,
            'follow_up_notes' => $needsFollowUp ? ($validated['follow_up_notes'] ?? null) : null,
            'follow_up_resolved_at' => null,
        ]);

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Kunjungan dan pelayanan posyandu berhasil dicatat.');
    }

    public function update(UpdatePosyanduVisitRequest $request, Child $child, PosyanduVisit $visit): RedirectResponse
    {
        $validated = $request->validated();
        $needsFollowUp = array_key_exists('needs_follow_up', $validated)
            ? (bool) $validated['needs_follow_up']
            : $visit->needs_follow_up;

        $resolvedAt = $visit->follow_up_resolved_at;

        if (! $needsFollowUp) {
            $resolvedAt = null;
        } elseif (array_key_exists('resolve_follow_up', $validated)) {
            $resolvedAt = $validated['resolve_follow_up'] ? ($visit->follow_up_resolved_at ?? now()) : null;
        }

        $visit->update([
            'posyandu_schedule_id' => $validated['posyandu_schedule_id'] ?? $visit->posyandu_schedule_id,
            'visited_at' => $validated['visited_at'],
            'attendance_status' => $validated['attendance_status'],
            'services_provided' => $validated['services_provided'] ?? [],
            'service_notes' => $validated['service_notes'] ?? null,
            'needs_follow_up' => $needsFollowUp,
            'follow_up_notes' => $needsFollowUp ? ($validated['follow_up_notes'] ?? $visit->follow_up_notes) : null,
            'follow_up_resolved_at' => $resolvedAt,
        ]);

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Catatan kunjungan posyandu berhasil diperbarui.');
    }

    public function destroy(Child $child, PosyanduVisit $visit): RedirectResponse
    {
        Gate::authorize('delete', $visit);

        $visit->delete();

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Catatan kunjungan posyandu berhasil dihapus.');
    }
}
