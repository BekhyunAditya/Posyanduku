<?php

use App\Enums\Gender;
use App\Models\Child;
use App\Models\Posyandu;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows parent to create, view, update, and delete their own child profile', function () {
    $posyandu = Posyandu::factory()->create(['code' => 'POS-MLT-01']);
    $parent = User::factory()->orangTua()->create(['posyandu_id' => null]);

    $this->actingAs($parent)
        ->get(route('ortu.children.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/TambahProfilAnak')
            ->has('posyandus', 1)
        );

    // Create child using posyandu_code and Indonesian gender label
    $this->actingAs($parent)
        ->post(route('ortu.children.store'), [
            'name' => 'Aruna Putri',
            'nickname' => 'Aruna',
            'birth_date' => now()->subMonths(18)->toDateString(),
            'gender' => 'Perempuan',
            'posyandu_code' => 'pos-mlt-01',
            'birth_weight_kg' => 3.20,
            'birth_height_cm' => 49.5,
            'blood_type' => 'O',
        ])
        ->assertRedirect(route('ortu.children.confirm'));

    $child = Child::query()->where('name', 'Aruna Putri')->firstOrFail();

    expect($child->parent_id)->toBe($parent->id)
        ->and($child->posyandu_id)->toBe($posyandu->id)
        ->and($child->gender)->toBe(Gender::Female)
        ->and($parent->fresh()->posyandu_id)->toBe($posyandu->id);

    // Confirm page displays savedChild
    $this->actingAs($parent)
        ->get(route('ortu.children.confirm'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/KonfirmasiPenyimpanan')
            ->where('savedChild.id', $child->id)
            ->where('savedChild.age_months', 18)
        );

    // Index lists only parent's children
    $this->actingAs($parent)
        ->get(route('ortu.children.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/ProfilAnak')
            ->has('children', 1)
            ->where('selectedChild.id', $child->id)
        );

    // Update child
    $this->actingAs($parent)
        ->put(route('ortu.children.update', $child), [
            'name' => 'Aruna Putri Wijaya',
            'nickname' => 'Aruna',
            'birth_date' => now()->subMonths(18)->toDateString(),
            'gender' => 'P',
            'posyandu_id' => $posyandu->id,
            'notes' => 'Alergi kacang ringan',
        ])
        ->assertRedirect(route('ortu.children.confirm'));

    expect($child->fresh()->name)->toBe('Aruna Putri Wijaya')
        ->and($child->fresh()->notes)->toBe('Alergi kacang ringan');

    // Delete child
    $this->actingAs($parent)
        ->delete(route('ortu.children.destroy', $child))
        ->assertRedirect(route('ortu.children.index'));

    $this->assertDatabaseMissing('children', ['id' => $child->id]);
});

it('prevents a parent from updating or deleting another parents child profile', function () {
    $parentA = User::factory()->orangTua()->create();
    $parentB = User::factory()->orangTua()->create();
    $childA = Child::factory()->create(['parent_id' => $parentA->id]);

    $this->actingAs($parentB)
        ->put(route('ortu.children.update', $childA), [
            'name' => 'Diubah Orang Lain',
            'birth_date' => now()->subMonths(12)->toDateString(),
            'gender' => 'L',
        ])
        ->assertForbidden();

    $this->actingAs($parentB)
        ->delete(route('ortu.children.destroy', $childA))
        ->assertForbidden();

    $this->assertDatabaseHas('children', ['id' => $childA->id, 'name' => $childA->name]);
});

it('validates future birth dates and invalid posyandu codes on child store', function () {
    $parent = User::factory()->orangTua()->create();

    $this->actingAs($parent)
        ->post(route('ortu.children.store'), [
            'name' => 'Bayi Masa Depan',
            'birth_date' => now()->addDay()->toDateString(),
            'gender' => 'L',
            'posyandu_code' => 'TIDAK-ADA',
        ])
        ->assertSessionHasErrors(['birth_date', 'posyandu_code']);
});
