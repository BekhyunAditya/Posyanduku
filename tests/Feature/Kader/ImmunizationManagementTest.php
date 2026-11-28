<?php

use App\Enums\ImmunizationStatus;
use App\Enums\VerificationStatus;
use App\Models\Child;
use App\Models\ChildImmunization;
use App\Models\ImmunizationSchedule;
use App\Models\Posyandu;
use App\Models\User;

it('allows verified kader to record, update verification status, and delete child immunizations', function () {
    $posyandu = Posyandu::factory()->create();
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'posyandu_id' => $posyandu->id,
        'birth_date' => now()->subMonths(6)->toDateString(),
    ]);
    $schedule = ImmunizationSchedule::factory()->create(['code' => 'BCG-TEST', 'target_age_months' => 1]);

    // Store immunization (defaults to pending_nakes when recorded)
    $this->actingAs($kader)
        ->post(route('kader.immunizations.store', $child), [
            'immunization_schedule_id' => $schedule->id,
            'status' => ImmunizationStatus::Recorded->value,
            'administered_at' => now()->subMonths(5)->toDateString(),
            'location' => 'Posyandu Melati 01',
            'notes' => 'Dicatat sesuai Buku KIA',
        ])
        ->assertRedirect(route('kader.children.show', $child));

    $record = ChildImmunization::query()
        ->where('child_id', $child->id)
        ->where('immunization_schedule_id', $schedule->id)
        ->firstOrFail();

    expect($record->status)->toBe(ImmunizationStatus::Recorded)
        ->and($record->verification_status)->toBe(VerificationStatus::PendingNakes)
        ->and($record->verified_at)->toBeNull();

    // Update verification status to verified_nakes with health worker name
    $this->actingAs($kader)
        ->put(route('kader.immunizations.update', [$child, $record]), [
            'status' => ImmunizationStatus::Recorded->value,
            'administered_at' => now()->subMonths(5)->toDateString(),
            'verification_status' => VerificationStatus::VerifiedNakes->value,
            'verified_by_name' => 'Bidan Rina, A.Md.Keb',
            'location' => 'Puskesmas Sukamaju',
        ])
        ->assertRedirect(route('kader.children.show', $child));

    expect($record->fresh()->verification_status)->toBe(VerificationStatus::VerifiedNakes)
        ->and($record->fresh()->verified_by_name)->toBe('Bidan Rina, A.Md.Keb')
        ->and($record->fresh()->verified_at)->not->toBeNull();

    // Delete immunization record
    $this->actingAs($kader)
        ->delete(route('kader.immunizations.destroy', [$child, $record]))
        ->assertRedirect(route('kader.children.show', $child));

    $this->assertDatabaseMissing('child_immunizations', ['id' => $record->id]);
});

it('validates administered_at and verified_by_name requirements on immunization recording', function () {
    $posyandu = Posyandu::factory()->create();
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'posyandu_id' => $posyandu->id,
        'birth_date' => now()->subMonths(6)->toDateString(),
    ]);
    $schedule = ImmunizationSchedule::factory()->create();

    $this->actingAs($kader)
        ->post(route('kader.immunizations.store', $child), [
            'immunization_schedule_id' => $schedule->id,
            'status' => ImmunizationStatus::Recorded->value,
            'verification_status' => VerificationStatus::VerifiedNakes->value,
        ])
        ->assertSessionHasErrors(['administered_at', 'verified_by_name']);
});

it('forbids cross-posyandu kader, unverified kader, parents, and admin from modifying immunizations', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $kaderA = User::factory()->kader($posyanduA)->create();
    $kaderB = User::factory()->kader($posyanduB)->create();
    $unverifiedKaderA = User::factory()->unverifiedKader($posyanduA)->create();
    $parent = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $admin = User::factory()->admin()->create();

    $childA = Child::factory()->create(['parent_id' => $parent->id, 'posyandu_id' => $posyanduA->id]);
    $otherChildA = Child::factory()->create(['posyandu_id' => $posyanduA->id]);
    $schedule = ImmunizationSchedule::factory()->create();
    $recordA = ChildImmunization::factory()->create([
        'child_id' => $childA->id,
        'immunization_schedule_id' => $schedule->id,
        'recorded_by' => $kaderA->id,
    ]);

    $payload = [
        'immunization_schedule_id' => $schedule->id,
        'status' => ImmunizationStatus::Recorded->value,
        'administered_at' => today()->toDateString(),
    ];

    $this->actingAs($kaderB)->post(route('kader.immunizations.store', $childA), $payload)->assertForbidden();
    $this->actingAs($kaderB)->put(route('kader.immunizations.update', [$childA, $recordA]), $payload)->assertForbidden();
    $this->actingAs($kaderB)->delete(route('kader.immunizations.destroy', [$childA, $recordA]))->assertForbidden();

    $this->actingAs($unverifiedKaderA)->post(route('kader.immunizations.store', $childA), $payload)->assertForbidden();
    $this->actingAs($parent)->post(route('kader.immunizations.store', $childA), $payload)->assertForbidden();
    $this->actingAs($admin)->post(route('kader.immunizations.store', $childA), $payload)->assertForbidden();

    // Scoped binding prevents cross-child URL tampering
    $this->actingAs($kaderA)
        ->put(route('kader.immunizations.update', [$otherChildA, $recordA]), $payload)
        ->assertNotFound();
});
