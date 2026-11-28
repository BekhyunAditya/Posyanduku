<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kader\StorePosyanduScheduleRequest;
use App\Http\Requests\Kader\UpdatePosyanduScheduleRequest;
use App\Models\PosyanduSchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', PosyanduSchedule::class);

        $kader = $request->user();
        $scope = $request->string('scope')->toString();

        $schedules = PosyanduSchedule::query()
            ->with('creator:id,name')
            ->withCount('visits')
            ->where('posyandu_id', $kader->posyandu_id)
            ->when($scope === 'upcoming', fn ($query) => $query->whereDate('scheduled_date', '>=', today()))
            ->when($scope === 'past', fn ($query) => $query->whereDate('scheduled_date', '<', today()))
            ->orderByDesc('scheduled_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Kader/KelolaJadwal', [
            'schedules' => $schedules,
            'filters' => [
                'scope' => $scope,
            ],
        ]);
    }

    public function store(StorePosyanduScheduleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        PosyanduSchedule::query()->create([
            'posyandu_id' => $request->user()->posyandu_id,
            'created_by' => $request->user()->id,
            'title' => $validated['title'],
            'activity_type' => $validated['activity_type'],
            'scheduled_date' => $validated['scheduled_date'],
            'start_time' => $validated['start_time'].':00',
            'end_time' => ! empty($validated['end_time']) ? $validated['end_time'].':00' : null,
            'location' => $validated['location'],
            'required_items' => $validated['required_items'] ?? [],
            'description' => $validated['description'] ?? null,
            'is_published' => (bool) ($validated['is_published'] ?? true),
        ]);

        return redirect()->route('kader.schedules.index')
            ->with('status', 'Jadwal kegiatan posyandu berhasil ditambahkan.');
    }

    public function update(UpdatePosyanduScheduleRequest $request, PosyanduSchedule $schedule): RedirectResponse
    {
        $validated = $request->validated();

        $schedule->update([
            'title' => $validated['title'],
            'activity_type' => $validated['activity_type'],
            'scheduled_date' => $validated['scheduled_date'],
            'start_time' => $validated['start_time'].':00',
            'end_time' => ! empty($validated['end_time']) ? $validated['end_time'].':00' : null,
            'location' => $validated['location'],
            'required_items' => $validated['required_items'] ?? [],
            'description' => $validated['description'] ?? null,
            'is_published' => array_key_exists('is_published', $validated)
                ? (bool) $validated['is_published']
                : $schedule->is_published,
        ]);

        return redirect()->route('kader.schedules.index')
            ->with('status', 'Jadwal kegiatan posyandu berhasil diperbarui.');
    }

    public function destroy(PosyanduSchedule $schedule): RedirectResponse
    {
        Gate::authorize('delete', $schedule);

        $schedule->delete();

        return redirect()->route('kader.schedules.index')
            ->with('status', 'Jadwal kegiatan posyandu berhasil dihapus.');
    }
}
