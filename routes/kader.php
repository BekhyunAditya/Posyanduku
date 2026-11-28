<?php

use App\Http\Controllers\Kader\ChildManagementController;
use Illuminate\Support\Facades\Route;

// ========================================
// HALAMAN KADER POSYANDU
// ========================================
Route::middleware(['auth', 'role:kader', 'verified.kader'])
    ->prefix('kader')
    ->name('kader.')
    ->group(function (): void {
        Route::inertia('/dashboard', 'Kader/DashboardKader')->name('dashboard');

        // Daftar & Detail Balita Binaan (#13)
        Route::get('/data-balita', [ChildManagementController::class, 'index'])->name('children.index');
        Route::get('/daftar-balita', [ChildManagementController::class, 'index'])->name('children.list');
        Route::get('/balita/{child}', [ChildManagementController::class, 'show'])->name('children.show');

        Route::inertia('/jadwal-kegiatan', 'Kader/KelolaJadwal')->name('schedules.index');
    });
