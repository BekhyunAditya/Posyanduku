<?php

use App\Enums\UserRole;
use App\Models\Posyandu;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows admin to list, filter, create, update, verify kader, and delete users', function () {
    $admin = User::factory()->admin()->create();
    $posyandu = Posyandu::factory()->create();
    $pendingKader = User::factory()->unverifiedKader($posyandu)->create(['name' => 'Kader Pending']);

    $this->actingAs($admin)
        ->get(route('admin.users.index', ['kader_status' => 'pending']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/KelolaPengguna')
            ->where('pendingKaderCount', 1)
            ->has('users.data', 1)
            ->where('users.data.0.id', $pendingKader->id)
        );

    // Create new kader
    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'Budi Kader',
            'email' => 'budi.kader@posyanduku.test',
            'password' => 'password123',
            'role' => UserRole::Kader->value,
            'phone' => '081234567890',
            'posyandu_id' => $posyandu->id,
            'verify_kader' => true,
        ])
        ->assertRedirect(route('admin.users.index'));

    $createdKader = User::query()->where('email', 'budi.kader@posyanduku.test')->firstOrFail();
    expect($createdKader->isVerifiedKader())->toBeTrue();

    // Verify pending kader
    $this->actingAs($admin)
        ->patch(route('admin.users.verify-kader', $pendingKader))
        ->assertRedirect(route('admin.users.index'));

    expect($pendingKader->fresh()->isVerifiedKader())->toBeTrue();

    // Update user role from kader to orang_tua resets kader_verified_at
    $this->actingAs($admin)
        ->patch(route('admin.users.update', $createdKader), [
            'name' => 'Budi Orang Tua',
            'email' => $createdKader->email,
            'role' => UserRole::OrangTua->value,
            'posyandu_id' => $posyandu->id,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.users.index'));

    expect($createdKader->fresh()->role)->toBe(UserRole::OrangTua)
        ->and($createdKader->fresh()->kader_verified_at)->toBeNull();

    // Delete user
    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $createdKader))
        ->assertRedirect(route('admin.users.index'));

    $this->assertDatabaseMissing('users', ['id' => $createdKader->id]);
});

it('prevents admin from self-demotion, self-deactivation, self-deletion, or verifying non-kader', function () {
    $admin = User::factory()->admin()->create();
    $parent = User::factory()->orangTua()->create();

    $this->actingAs($admin)
        ->patch(route('admin.users.update', $admin), [
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => UserRole::OrangTua->value,
            'is_active' => false,
        ])
        ->assertSessionHasErrors('role');

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertSessionHasErrors('user');

    $this->actingAs($admin)
        ->patch(route('admin.users.verify-kader', $parent))
        ->assertSessionHasErrors('user');

    $this->assertDatabaseHas('users', ['id' => $admin->id, 'role' => UserRole::Admin->value, 'is_active' => true]);
});

it('validates required posyandu_id when creating a kader and forbids non-admin access', function () {
    $admin = User::factory()->admin()->create();
    $kader = User::factory()->kader()->create();

    $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'Kader Tanpa Posyandu',
            'email' => 'tanpa.posyandu@posyanduku.test',
            'password' => 'password123',
            'role' => UserRole::Kader->value,
        ])
        ->assertSessionHasErrors('posyandu_id');

    $this->actingAs($kader)
        ->post(route('admin.users.store'), [])
        ->assertForbidden();
});
