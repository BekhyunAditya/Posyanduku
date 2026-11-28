<?php

use App\Models\User;

it('allows guests to access public pages', function (string $uri) {
    $this->get($uri)->assertOk();
})->with([
    'landing page' => ['/'],
    'education index' => ['/edukasi'],
    'education detail' => ['/edukasi/panduan-asi-eksklusif'],
]);

it('redirects guests to login when accessing protected role routes', function (string $uri) {
    $this->get($uri)->assertRedirect(route('login'));
})->with([
    'ortu dashboard' => ['/ortu/dashboard'],
    'ortu growth' => ['/ortu/pertumbuhan'],
    'kader dashboard' => ['/kader/dashboard'],
    'kader schedules' => ['/kader/jadwal-kegiatan'],
    'admin dashboard' => ['/admin/dashboard'],
    'admin users' => ['/admin/pengguna'],
]);

it('redirects /dashboard to the matching role dashboard', function () {
    $orangTua = User::factory()->orangTua()->create();
    $kader = User::factory()->kader()->create();
    $admin = User::factory()->admin()->create();

    $this->actingAs($orangTua)->get('/dashboard')->assertRedirect(route('ortu.dashboard'));
    $this->actingAs($kader)->get('/dashboard')->assertRedirect(route('kader.dashboard'));
    $this->actingAs($admin)->get('/dashboard')->assertRedirect(route('admin.dashboard'));
});

it('allows orang tua to access ortu routes and forbids kader and admin routes', function () {
    $orangTua = User::factory()->orangTua()->create();

    $this->actingAs($orangTua)->get('/ortu/dashboard')->assertOk();
    $this->actingAs($orangTua)->get('/ortu/buku-kia')->assertOk();
    $this->actingAs($orangTua)->get('/kader/dashboard')->assertForbidden();
    $this->actingAs($orangTua)->get('/admin/dashboard')->assertForbidden();
});

it('allows verified kader to access kader routes and blocks unverified kader', function () {
    $verifiedKader = User::factory()->kader()->create();
    $unverifiedKader = User::factory()->unverifiedKader()->create();

    $this->actingAs($verifiedKader)->get('/kader/dashboard')->assertOk();
    $this->actingAs($verifiedKader)->get('/kader/jadwal-kegiatan')->assertOk();
    $this->actingAs($verifiedKader)->get('/ortu/dashboard')->assertForbidden();
    $this->actingAs($verifiedKader)->get('/admin/dashboard')->assertForbidden();

    $this->actingAs($unverifiedKader)->get('/kader/dashboard')->assertForbidden();
    $this->actingAs($unverifiedKader)->get('/kader/jadwal-kegiatan')->assertForbidden();
});

it('allows admin to access admin routes and forbids non-admin routes', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin/dashboard')->assertOk();
    $this->actingAs($admin)->get('/admin/pengguna')->assertOk();
    $this->actingAs($admin)->get('/admin/posyandu')->assertOk();
    $this->actingAs($admin)->get('/admin/edukasi')->assertOk();
    $this->actingAs($admin)->get('/admin/pengaturan')->assertOk();
    $this->actingAs($admin)->get('/ortu/dashboard')->assertForbidden();
    $this->actingAs($admin)->get('/kader/dashboard')->assertForbidden();
});

it('forbids inactive users from accessing role routes', function () {
    $inactiveParent = User::factory()->orangTua()->inactive()->create();

    $this->actingAs($inactiveParent)->get('/ortu/dashboard')->assertForbidden();
});
