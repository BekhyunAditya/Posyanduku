<?php

use App\Enums\ImmunizationStatus;
use App\Enums\VerificationStatus;
use App\Models\Child;
use App\Models\ChildImmunization;
use App\Models\ImmunizationSchedule;
use App\Models\Posyandu;
use App\Models\User;
use Database\Seeders\ImmunizationScheduleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('shows Kemenkes immunization schedules, recorded history, verification status, and next immunization for parent', function () {
    $this->seed(ImmunizationScheduleSeeder::class);

    $posyandu = Posyandu::factory()->create();
    $parent = User::factory()->orangTua()->create(['posyandu_id' => $posyandu->id]);
    $kader = User::factory()->kader($posyandu)->create();

    $child = Child::factory()->create([
        'parent_id' => $parent->id,
        'posyandu_id' => $posyandu->id,
        'birth_date' => now()->subMonths(2)->toDateString(),
    ]);

    $hb0 = ImmunizationSchedule::query()->where('code', 'HB-0')->firstOrFail();
    $bcg = ImmunizationSchedule::query()->where('code', 'BCG')->firstOrFail();

    ChildImmunization::factory()->create([
        'child_id' => $child->id,
        'immunization_schedule_id' => $hb0->id,
        'status' => ImmunizationStatus::Recorded,
        'verification_status' => VerificationStatus::VerifiedNakes,
        'verified_by_name' => 'Bidan Rina',
        'verified_at' => now(),
        'recorded_by' => $kader->id,
    ]);

    ChildImmunization::factory()->create([
        'child_id' => $child->id,
        'immunization_schedule_id' => $bcg->id,
        'status' => ImmunizationStatus::Recorded,
        'verification_status' => VerificationStatus::PendingNakes,
        'recorded_by' => $kader->id,
    ]);

    $this->actingAs($parent)
        ->get(route('ortu.immunizations.index', ['child_id' => $child->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/JadwalImunisasi')
            ->where('selectedChildId', $child->id)
            ->has('immunization.schedules', 20)
            ->has('immunization.history', 2)
            ->where('immunization.summary.total_schedules', 20)
            ->where('immunization.summary.recorded_count', 2)
            ->where('immunization.summary.verified_count', 1)
            ->where('immunization.summary.pending_verification_count', 1)
            ->where('immunization.summary.remaining_count', 18)
            ->where('immunization.next_immunization.code', 'OPV-1')
            ->where('immunization.next_immunization.status', 'overdue')
        );
});

it('prevents parent from viewing another parents child immunization data and handles empty child list', function () {
    $parentA = User::factory()->orangTua()->create();
    $parentB = User::factory()->orangTua()->create();
    $parentWithoutChild = User::factory()->orangTua()->create();

    $childA = Child::factory()->create(['parent_id' => $parentA->id, 'name' => 'Anak A']);
    $childB = Child::factory()->create(['parent_id' => $parentB->id, 'name' => 'Anak B']);

    $this->actingAs($parentA)
        ->get(route('ortu.immunizations.index', ['child_id' => $childB->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('selectedChildId', $childA->id)
            ->where('immunization.child.name', 'Anak A')
        );

    $this->actingAs($parentWithoutChild)
        ->get(route('ortu.immunizations.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('selectedChildId', null)
            ->where('immunization', null)
        );
});
