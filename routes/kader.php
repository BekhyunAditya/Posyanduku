<?php

use App\Http\Controllers\Kader\ChildManagementController;
use App\Http\Controllers\Kader\MeasurementController;
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

        // Pencatatan & Riwayat Pengukuran (#14, #15)
        Route::get('/pengukuran', [MeasurementController::class, 'index'])->name('measurements.index');
        Route::post('/balita/{child}/pengukuran', [MeasurementController::class, 'store'])->name('measurements.store');
        Route::put('/balita/{child}/pengukuran/{growthMeasurement}', [MeasurementController::class, 'update'])
            ->scopeBindings()
            ->name('measurements.update');
        Route::delete('/balita/{child}/pengukuran/{growthMeasurement}', [MeasurementController::class, 'destroy'])
            ->scopeBindings()
            ->name('measurements.destroy');

        Route::inertia('/jadwal-kegiatan', 'Kader/KelolaJadwal')->name('schedules.index');
    });
