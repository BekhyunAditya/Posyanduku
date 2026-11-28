<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

// ========================================
// HALAMAN KADER POSYANDU
// ========================================
Route::middleware(['auth', 'role:kader', 'verified.kader'])
    ->prefix('kader')
    ->name('kader.')
    ->group(function (): void {
        Route::inertia('/dashboard', 'Kader/DashboardKader')->name('dashboard');
        Route::inertia('/data-balita', 'Kader/DataBalita')->name('children.index');
        Route::inertia('/daftar-balita', 'Kader/DaftarBalita')->name('children.list');
        Route::get('/balita/{child}', fn (string $child): Response => Inertia::render('Kader/DetailBalitaKader', [
            'childId' => $child,
        ]))->name('children.show');
        Route::inertia('/jadwal-kegiatan', 'Kader/KelolaJadwal')->name('schedules.index');
    });
