<?php

use App\Http\Controllers\Ortu\ChildController;
use App\Http\Controllers\Ortu\ConsultationNoteController;
use Illuminate\Support\Facades\Route;

// ========================================
// HALAMAN ORANG TUA
// ========================================
Route::middleware(['auth', 'role:orang_tua'])
    ->prefix('ortu')
    ->name('ortu.')
    ->group(function (): void {
        Route::inertia('/dashboard', 'OrangTua/DashboardOrtu')->name('dashboard');
        Route::inertia('/pertumbuhan', 'OrangTua/PantauPertumbuhan')->name('growth.index');
        Route::inertia('/buku-kia', 'OrangTua/BukuKiaDigital')->name('buku-kia.show');
        Route::inertia('/panduan-kunjungan', 'OrangTua/PanduanKunjungan')->name('visit-guide.index');

        // Catatan Konsultasi (#11)
        Route::get('/panduan-kunjungan/catatan', [ConsultationNoteController::class, 'create'])->name('consultation-notes.create');
        Route::post('/panduan-kunjungan/catatan', [ConsultationNoteController::class, 'store'])->name('consultation-notes.store');
        Route::get('/panduan-kunjungan/catatan-tersimpan', [ConsultationNoteController::class, 'saved'])->name('consultation-notes.saved');
        Route::put('/panduan-kunjungan/catatan/{consultationNote}', [ConsultationNoteController::class, 'update'])->name('consultation-notes.update');
        Route::delete('/panduan-kunjungan/catatan/{consultationNote}', [ConsultationNoteController::class, 'destroy'])->name('consultation-notes.destroy');
        Route::get('/panduan-tindakan', [ConsultationNoteController::class, 'create'])->name('action-guide.show');

        Route::inertia('/jadwal-posyandu', 'OrangTua/KalenderPosyandu')->name('schedules.index');
        Route::inertia('/pengingat', 'OrangTua/NotifikasiPengingat')->name('notifications.index');

        // CRUD Profil Anak (#11)
        Route::get('/profil-anak', [ChildController::class, 'index'])->name('children.index');
        Route::get('/tambah-anak', [ChildController::class, 'create'])->name('children.create');
        Route::post('/profil-anak', [ChildController::class, 'store'])->name('children.store');
        Route::get('/profil-anak/konfirmasi', [ChildController::class, 'confirm'])->name('children.confirm');
        Route::put('/profil-anak/{child}', [ChildController::class, 'update'])->name('children.update');
        Route::delete('/profil-anak/{child}', [ChildController::class, 'destroy'])->name('children.destroy');

        Route::inertia('/imunisasi', 'OrangTua/JadwalImunisasi')->name('immunizations.index');
    });
