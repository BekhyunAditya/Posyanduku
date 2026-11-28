<?php

use Illuminate\Support\Facades\Route;

// ========================================
// HALAMAN ADMIN
// ========================================
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::inertia('/dashboard', 'Admin/DashboardAdmin')->name('dashboard');
        Route::inertia('/pengguna', 'Admin/KelolaPengguna')->name('users.index');
        Route::inertia('/posyandu', 'Admin/KelolaPosyandu')->name('posyandus.index');
        Route::inertia('/edukasi', 'Admin/KelolaEdukasi')->name('education.index');
        Route::inertia('/pengaturan', 'Admin/PengaturanSistem')->name('settings.index');
    });
