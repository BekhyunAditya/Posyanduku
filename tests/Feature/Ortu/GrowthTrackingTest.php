<?php

use App\Enums\Gender;
use App\Models\Child;
use App\Models\GrowthMeasurement;
use App\Models\Posyandu;
use App\Models\User;
use Database\Seeders\WhoGrowthStandardSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders child growth chart points, gender-matched WHO curves, and non-diagnostic comparison for parent', function () {
    $this->seed(WhoGrowthStandardSeeder::class);

    $posyandu = Posyandu::factory()->create();
    $parent = User::factory()->orangTua()->create(['posyandu_id' => $posyandu->id]);
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'parent_id' => $parent->id,
        'posyandu_id' => $posyandu->id,
        'gender' => Gender::Female,
        'birth_date' => now()->subMonths(12)->toDateString(),
    ]);

    GrowthMeasurement::factory()->create([
        'child_id' => $child->id,
        'kader_id' => $kader->id,
        'measured_at' => now()->subMonth()->toDateString(),
        'age_months' => 11,
        'weight_kg' => 8.80,
        'height_cm' => 73.0,
    ]);
    GrowthMeasurement::factory()->create([
        'child_id' => $child->id,
        'kader_id' => $kader->id,
        'measured_at' => today()->toDateString(),
        'age_months' => 12,
        'weight_kg' => 8.80,
        'height_cm' => 73.8,
        'weight_delta_kg' => 0.00,
        'height_delta_cm' => 0.8,
    ]);

    $response = $this->actingAs($parent)
        ->get(route('ortu.growth.index', ['child_id' => $child->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/PantauPertumbuhan')
            ->where('selectedChildId', $child->id)
            ->has('growth.points', 2)
            ->has('growth.history', 2)
            ->has('growth.who_curves.weight_for_age', 18)
            ->has('growth.who_curves.height_for_age', 18)
            ->where('growth.who_curves.weight_for_age.0.median', 3.2)
            ->where('growth.comparison.weight_trend', 'tetap')
            ->where('growth.comparison.height_trend', 'meningkat')
            ->where('growth.comparison.needs_attention_note', true)
            ->where('growth.comparison.weight_delta_kg', 0)
        );

    // Ensure summary message never performs automated medical diagnosis
    $summary = strtolower((string) $response->inertiaProps('growth.comparison.summary_message'));
    expect($summary)->not->toContain('stunting')
        ->and($summary)->not->toContain('gizi buruk');
});

it('prevents parent from viewing another parents child growth data via child_id query', function () {
    $parentA = User::factory()->orangTua()->create();
    $parentB = User::factory()->orangTua()->create();

    $childA = Child::factory()->create(['parent_id' => $parentA->id, 'name' => 'Anak A']);
    $childB = Child::factory()->create(['parent_id' => $parentB->id, 'name' => 'Anak B']);

    $this->actingAs($parentA)
        ->get(route('ortu.growth.index', ['child_id' => $childB->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('selectedChildId', $childA->id)
            ->where('growth.child.name', 'Anak A')
        );
});

it('handles parent with no children gracefully on growth page', function () {
    $parent = User::factory()->orangTua()->create();

    $this->actingAs($parent)
        ->get(route('ortu.growth.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/PantauPertumbuhan')
            ->where('selectedChildId', null)
            ->where('growth', null)
        );
});
