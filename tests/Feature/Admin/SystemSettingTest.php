<?php

use App\Models\SystemSetting;
use App\Models\User;
use Database\Seeders\SystemSettingSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('allows admin to view and update system settings', function () {
    $this->seed(SystemSettingSeeder::class);
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.settings.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/PengaturanSistem')
            ->has('settings', 6)
        );

    $this->actingAs($admin)
        ->patch(route('admin.settings.update'), [
            'settings' => [
                ['key' => 'site_name', 'value' => 'PosyanduKu Nusantara'],
                ['key' => 'notifications_in_app_enabled', 'value' => false],
            ],
        ])
        ->assertRedirect(route('admin.settings.index'));

    expect(SystemSetting::getValue('site_name'))->toBe('PosyanduKu Nusantara')
        ->and(SystemSetting::getValue('notifications_in_app_enabled'))->toBeFalse();

    $updatedSetting = SystemSetting::query()->where('key', 'site_name')->firstOrFail();
    expect($updatedSetting->updated_by)->toBe($admin->id);
});

it('rejects unknown setting keys and blocks non-admin updates', function () {
    $admin = User::factory()->admin()->create();
    $kader = User::factory()->kader()->create();

    $this->actingAs($admin)
        ->patch(route('admin.settings.update'), [
            'settings' => [
                ['key' => 'unknown_setting_key', 'value' => 'abc'],
            ],
        ])
        ->assertSessionHasErrors('settings.0.key');

    $this->actingAs($kader)
        ->patch(route('admin.settings.update'), [
            'settings' => [
                ['key' => 'site_name', 'value' => 'Hacked'],
            ],
        ])
        ->assertForbidden();
});
