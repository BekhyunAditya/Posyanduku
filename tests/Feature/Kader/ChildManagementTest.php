<?php

use App\Enums\Gender;
use App\Models\Child;
use App\Models\Posyandu;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('shows only children in the verified kaders posyandu with accurate stats and filters', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $kaderA = User::factory()->kader($posyanduA)->create();

    $boyA = Child::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'name' => 'Bima Pratama',
        'gender' => Gender::Male,
        'birth_date' => now()->subMonths(8)->toDateString(),
    ]);
    $girlA = Child::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'name' => 'Aruna Putri',
        'gender' => Gender::Female,
        'birth_date' => now()->subMonths(20)->toDateString(),
    ]);
    Child::factory()->create([
        'posyandu_id' => $posyanduB->id,
        'name' => 'Balita Posyandu Lain',
        'gender' => Gender::Male,
    ]);

    // Unfiltered index shows only Posyandu A's 2 children
    $this->actingAs($kaderA)
        ->get(route('kader.children.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Kader/DataBalita')
            ->where('stats.total', 2)
            ->where('stats.male', 1)
            ->where('stats.female', 1)
            ->has('children.data', 2)
        );

    // Filter by age group 0-12 and gender L
    $this->actingAs($kaderA)
        ->get(route('kader.children.index', ['age_group' => '0-12', 'gender' => 'Laki-laki']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('children.data', 1)
            ->where('children.data.0.id', $boyA->id)
        );

    // Filter by search
    $this->actingAs($kaderA)
        ->get(route('kader.children.index', ['search' => 'Aruna']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('children.data', 1)
            ->where('children.data.0.id', $girlA->id)
        );
});

it('allows verified kader to view child details in their posyandu and forbids other posyandu children', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $kaderA = User::factory()->kader($posyanduA)->create();
    $childA = Child::factory()->create(['posyandu_id' => $posyanduA->id]);
    $childB = Child::factory()->create(['posyandu_id' => $posyanduB->id]);

    $this->actingAs($kaderA)
        ->get(route('kader.children.show', $childA))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Kader/DetailBalitaKader')
            ->where('child.id', $childA->id)
            ->where('child.name', $childA->name)
        );

    $this->actingAs($kaderA)
        ->get(route('kader.children.show', $childB))
        ->assertForbidden();
});
