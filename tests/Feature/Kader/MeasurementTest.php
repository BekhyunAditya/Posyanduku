<?php

use App\Models\Child;
use App\Models\GrowthMeasurement;
use App\Models\Posyandu;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows verified kader to create, update, and delete measurements while recalculating deltas chronologically', function () {
    $posyandu = Posyandu::factory()->create();
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'posyandu_id' => $posyandu->id,
        'birth_date' => now()->subMonths(15)->toDateString(),
    ]);

    // First measurement (2 months ago)
    $this->actingAs($kader)
        ->post(route('kader.measurements.store', $child), [
            'measured_at' => now()->subMonths(2)->toDateString(),
            'weight_kg' => 9.00,
            'height_cm' => 74.0,
            'head_circumference_cm' => 45.2,
            'notes' => 'Pengukuran pertama',
        ])
        ->assertRedirect(route('kader.children.show', $child));

    // Second measurement (1 month ago)
    $this->actingAs($kader)
        ->post(route('kader.measurements.store', $child), [
            'measured_at' => now()->subMonth()->toDateString(),
            'weight_kg' => 9.40,
            'height_cm' => 75.5,
            'notes' => 'Pengukuran kedua',
        ])
        ->assertRedirect(route('kader.children.show', $child));

    $measurements = $child->growthMeasurements()->orderBy('measured_at')->get();
    expect($measurements)->toHaveCount(2)
        ->and($measurements[0]->weight_delta_kg)->toBeNull()
        ->and((float) $measurements[1]->weight_delta_kg)->toBe(0.4)
        ->and((float) $measurements[1]->height_delta_cm)->toBe(1.5)
        ->and($measurements[1]->age_months)->toBe(14);

    // Kader measurements index returns posyandu measurements
    $this->actingAs($kader)
        ->get(route('kader.measurements.index', ['child_id' => $child->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('measurements.data', 2)
            ->has('children', 1)
        );

    // Update first measurement -> second measurement's delta must recalculate automatically
    $this->actingAs($kader)
        ->put(route('kader.measurements.update', [$child, $measurements[0]]), [
            'measured_at' => now()->subMonths(2)->toDateString(),
            'weight_kg' => 9.25,
            'height_cm' => 74.5,
            'notes' => 'Koreksi timbangan',
        ])
        ->assertRedirect(route('kader.children.show', $child));

    expect((float) $measurements[1]->fresh()->weight_delta_kg)->toBe(0.15)
        ->and((float) $measurements[1]->fresh()->height_delta_cm)->toBe(1.0);

    // Delete first measurement -> remaining measurement becomes baseline (delta = null)
    $this->actingAs($kader)
        ->delete(route('kader.measurements.destroy', [$child, $measurements[0]]))
        ->assertRedirect(route('kader.children.show', $child));

    $this->assertDatabaseMissing('growth_measurements', ['id' => $measurements[0]->id]);
    expect($measurements[1]->fresh()->weight_delta_kg)->toBeNull()
        ->and($measurements[1]->fresh()->height_delta_cm)->toBeNull();
});

it('rejects invalid measurement dates and out-of-range values', function () {
    $posyandu = Posyandu::factory()->create();
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'posyandu_id' => $posyandu->id,
        'birth_date' => now()->subMonths(10)->toDateString(),
    ]);

    // Future date & out-of-range weight/height
    $this->actingAs($kader)
        ->post(route('kader.measurements.store', $child), [
            'measured_at' => now()->addDay()->toDateString(),
            'weight_kg' => 0.2,
            'height_cm' => 200,
        ])
        ->assertSessionHasErrors(['measured_at', 'weight_kg', 'height_cm']);

    // Date before child's birth_date
    $this->actingAs($kader)
        ->post(route('kader.measurements.store', $child), [
            'measured_at' => now()->subMonths(12)->toDateString(),
            'weight_kg' => 8.0,
            'height_cm' => 70.0,
        ])
        ->assertSessionHasErrors('measured_at');
});

it('forbids cross-posyandu kader, unverified kader, parents, and admin from recording measurements', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $kaderA = User::factory()->kader($posyanduA)->create();
    $kaderB = User::factory()->kader($posyanduB)->create();
    $unverifiedKaderA = User::factory()->unverifiedKader($posyanduA)->create();
    $parent = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $admin = User::factory()->admin()->create();

    $childA = Child::factory()->create(['parent_id' => $parent->id, 'posyandu_id' => $posyanduA->id]);
    $otherChildA = Child::factory()->create(['posyandu_id' => $posyanduA->id]);
    $measurementA = GrowthMeasurement::factory()->create(['child_id' => $childA->id, 'kader_id' => $kaderA->id]);

    $payload = [
        'measured_at' => today()->toDateString(),
        'weight_kg' => 9.5,
        'height_cm' => 76.0,
    ];

    $this->actingAs($kaderB)->post(route('kader.measurements.store', $childA), $payload)->assertForbidden();
    $this->actingAs($kaderB)->put(route('kader.measurements.update', [$childA, $measurementA]), $payload)->assertForbidden();
    $this->actingAs($kaderB)->delete(route('kader.measurements.destroy', [$childA, $measurementA]))->assertForbidden();

    $this->actingAs($unverifiedKaderA)->post(route('kader.measurements.store', $childA), $payload)->assertForbidden();
    $this->actingAs($parent)->post(route('kader.measurements.store', $childA), $payload)->assertForbidden();
    $this->actingAs($admin)->post(route('kader.measurements.store', $childA), $payload)->assertForbidden();

    // Scoped binding prevents updating measurement via a different child URL
    $this->actingAs($kaderA)
        ->put(route('kader.measurements.update', [$otherChildA, $measurementA]), $payload)
        ->assertNotFound();
});
