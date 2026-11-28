<?php

use App\Models\Posyandu;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows admin to perform full CRUD on posyandus', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.posyandus.store'), [
            'name' => 'Posyandu Anggrek 05',
            'code' => 'POS-ANG-05',
            'address' => 'Jl. Anggrek No. 5',
            'rt' => '01',
            'rw' => '05',
            'village' => 'Sukajadi',
            'district' => 'Sukajadi',
            'city' => 'Bandung',
            'routine_schedule' => 'Selasa minggu ke-1, 08.00 - 11.00 WIB',
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.posyandus.index'));

    $posyandu = Posyandu::query()->where('code', 'POS-ANG-05')->firstOrFail();

    $this->actingAs($admin)
        ->get(route('admin.posyandus.index', ['search' => 'Anggrek']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/KelolaPosyandu')
            ->has('posyandus.data', 1)
            ->where('posyandus.data.0.code', 'POS-ANG-05')
        );

    $this->actingAs($admin)
        ->put(route('admin.posyandus.update', $posyandu), [
            'name' => 'Posyandu Anggrek 05 Updated',
            'code' => 'POS-ANG-05',
            'address' => 'Jl. Anggrek Baru No. 9',
            'is_active' => false,
        ])
        ->assertRedirect(route('admin.posyandus.index'));

    expect($posyandu->fresh()->name)->toBe('Posyandu Anggrek 05 Updated')
        ->and($posyandu->fresh()->is_active)->toBeFalse();

    $this->actingAs($admin)
        ->delete(route('admin.posyandus.destroy', $posyandu))
        ->assertRedirect(route('admin.posyandus.index'));

    $this->assertDatabaseMissing('posyandus', ['id' => $posyandu->id]);
});

it('rejects duplicate posyandu code and blocks non-admin access', function () {
    $admin = User::factory()->admin()->create();
    $parent = User::factory()->orangTua()->create();
    Posyandu::factory()->create(['code' => 'POS-DUP-01']);

    $this->actingAs($admin)
        ->post(route('admin.posyandus.store'), [
            'name' => 'Posyandu Duplikat',
            'code' => 'POS-DUP-01',
            'address' => 'Jl. Contoh 1',
        ])
        ->assertSessionHasErrors('code');

    $this->actingAs($parent)
        ->get(route('admin.posyandus.index'))
        ->assertForbidden();
});
