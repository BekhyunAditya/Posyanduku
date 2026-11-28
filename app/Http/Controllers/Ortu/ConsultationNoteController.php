<?php

namespace App\Http\Controllers\Ortu;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ortu\StoreConsultationNoteRequest;
use App\Http\Requests\Ortu\UpdateConsultationNoteRequest;
use App\Models\Child;
use App\Models\ConsultationNote;
use App\Models\PosyanduSchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ConsultationNoteController extends Controller
{
    public function create(Request $request): Response
    {
        Gate::authorize('viewAny', ConsultationNote::class);

        $user = $request->user();
        $children = $user->children()
            ->active()
            ->orderBy('name')
            ->get(['id', 'name', 'nickname', 'posyandu_id', 'birth_date'])
            ->map(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
                'posyandu_id' => $child->posyandu_id,
            ])
            ->all();

        $posyanduIds = collect($children)->pluck('posyandu_id')->filter()->unique()->values();

        $upcomingSchedules = $posyanduIds->isNotEmpty()
            ? PosyanduSchedule::query()
                ->published()
                ->upcoming()
                ->whereIn('posyandu_id', $posyanduIds)
                ->limit(5)
                ->get(['id', 'posyandu_id', 'title', 'scheduled_date', 'location'])
            : collect();

        $notes = $user->consultationNotes()
            ->with(['child:id,name,nickname', 'schedule:id,title,scheduled_date'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('OrangTua/CatatanKonsultasi', [
            'children' => $children,
            'upcomingSchedules' => $upcomingSchedules,
            'notes' => $notes,
        ]);
    }

    public function store(StoreConsultationNoteRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $note = $request->user()->consultationNotes()->create([
            'child_id' => $validated['child_id'],
            'posyandu_schedule_id' => $validated['posyandu_schedule_id'] ?? null,
            'title' => $validated['title'] ?? 'Catatan Persiapan Konsultasi',
            'eating_pattern_notes' => $validated['eating_pattern_notes'] ?? null,
            'questions' => $validated['questions'],
            'follow_up_plan' => $validated['follow_up_plan'] ?? null,
            'noted_at' => $validated['noted_at'] ?? today()->toDateString(),
        ]);

        $note->load(['child:id,name,nickname', 'schedule:id,title,scheduled_date']);

        return redirect()->route('ortu.consultation-notes.saved')
            ->with('savedNote', $note)
            ->with('status', 'Catatan konsultasi berhasil disimpan.');
    }

    public function saved(Request $request): Response
    {
        Gate::authorize('viewAny', ConsultationNote::class);

        $savedNote = $request->session()->get('savedNote')
            ?? $request->user()
                ->consultationNotes()
                ->with(['child:id,name,nickname', 'schedule:id,title,scheduled_date'])
                ->latest()
                ->first();

        return Inertia::render('OrangTua/CatatanTersimpan', [
            'savedNote' => $savedNote,
        ]);
    }

    public function update(UpdateConsultationNoteRequest $request, ConsultationNote $consultationNote): RedirectResponse
    {
        $validated = $request->validated();

        $consultationNote->update([
            'posyandu_schedule_id' => $validated['posyandu_schedule_id'] ?? $consultationNote->posyandu_schedule_id,
            'title' => $validated['title'] ?? $consultationNote->title,
            'eating_pattern_notes' => $validated['eating_pattern_notes'] ?? null,
            'questions' => $validated['questions'],
            'follow_up_plan' => $validated['follow_up_plan'] ?? null,
            'noted_at' => $validated['noted_at'] ?? $consultationNote->noted_at,
        ]);

        return redirect()->route('ortu.consultation-notes.create')
            ->with('status', 'Catatan konsultasi berhasil diperbarui.');
    }

    public function destroy(ConsultationNote $consultationNote): RedirectResponse
    {
        Gate::authorize('delete', $consultationNote);

        $consultationNote->delete();

        return redirect()->route('ortu.consultation-notes.create')
            ->with('status', 'Catatan konsultasi berhasil dihapus.');
    }
}
