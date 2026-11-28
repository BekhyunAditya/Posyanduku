<?php

namespace App\Http\Controllers\Kader;

use App\Enums\ImmunizationStatus;
use App\Enums\VerificationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Kader\StoreChildImmunizationRequest;
use App\Http\Requests\Kader\UpdateChildImmunizationRequest;
use App\Models\Child;
use App\Models\ChildImmunization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ImmunizationController extends Controller
{
    public function store(StoreChildImmunizationRequest $request, Child $child): RedirectResponse
    {
        $validated = $request->validated();
        $status = ImmunizationStatus::from($validated['status']);
        $verificationStatus = isset($validated['verification_status'])
            ? VerificationStatus::from($validated['verification_status'])
            : ($status === ImmunizationStatus::Recorded ? VerificationStatus::PendingNakes : VerificationStatus::Unverified);

        $isVerified = $verificationStatus === VerificationStatus::VerifiedNakes;

        ChildImmunization::query()->updateOrCreate(
            [
                'child_id' => $child->id,
                'immunization_schedule_id' => $validated['immunization_schedule_id'],
            ],
            [
                'status' => $status,
                'administered_at' => $validated['administered_at'] ?? null,
                'verification_status' => $verificationStatus,
                'recorded_by' => $request->user()->id,
                'verified_by_name' => $isVerified ? ($validated['verified_by_name'] ?? null) : null,
                'verified_at' => $isVerified ? now() : null,
                'location' => $validated['location'] ?? $child->posyandu?->name,
                'notes' => $validated['notes'] ?? null,
            ]
        );

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Catatan imunisasi balita berhasil disimpan.');
    }

    public function update(
        UpdateChildImmunizationRequest $request,
        Child $child,
        ChildImmunization $immunization
    ): RedirectResponse {
        $validated = $request->validated();
        $status = ImmunizationStatus::from($validated['status']);
        $verificationStatus = isset($validated['verification_status'])
            ? VerificationStatus::from($validated['verification_status'])
            : $immunization->verification_status;

        $isVerified = $verificationStatus === VerificationStatus::VerifiedNakes;

        $immunization->update([
            'status' => $status,
            'administered_at' => $validated['administered_at'] ?? null,
            'verification_status' => $verificationStatus,
            'recorded_by' => $request->user()->id,
            'verified_by_name' => $isVerified ? ($validated['verified_by_name'] ?? $immunization->verified_by_name) : null,
            'verified_at' => $isVerified ? ($immunization->verified_at ?? now()) : null,
            'location' => $validated['location'] ?? $immunization->location,
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Riwayat imunisasi balita berhasil diperbarui.');
    }

    public function destroy(Child $child, ChildImmunization $immunization): RedirectResponse
    {
        Gate::authorize('delete', $immunization);

        $immunization->delete();

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Catatan imunisasi balita berhasil dihapus.');
    }
}
