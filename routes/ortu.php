<?php

use App\Http\Controllers\Ortu\ChildController;
use App\Http\Controllers\Ortu\ConsultationNoteController;
use App\Http\Controllers\Ortu\GrowthController;
use App\Http\Controllers\Ortu\ImmunizationController;
use App\Http\Controllers\Ortu\ScheduleController;
use App\Http\Controllers\Ortu\VisitGuideController;
use Illuminate\Support\Facades\Route;

// ========================================
// HALAMAN ORANG TUA
// ========================================
Route::middleware(['auth', 'role:orang_tua'])
    ->prefix('ortu')
    ->name('ortu.')
    ->group(function (): void {
        Route::inertia('/dashboard', 'OrangTua/DashboardOrtu')->name('dashboard');

        // Pantau Pertumbuhan & Grafik WHO (#16, #17)
        Route::get('/pertumbuhan', [GrowthController::class, 'index'])->name('growth.index');

        Route::inertia('/buku-kia', 'OrangTua/BukuKiaDigital')->name('buku-kia.show');

        // Panduan Kunjungan & Checklist Kesiapan Posyandu (#25, #38)
        Route::get('/panduan-kunjungan', [VisitGuideController::class, 'index'])->name('visit-guide.index');
        Route::post('/checklist', [VisitGuideController::class, 'toggleChecklist'])->name('checklist.toggle');

        // Catatan Konsultasi (#11)
        Route::get('/panduan-kunjungan/catatan', [ConsultationNoteController::class, 'create'])->name('consultation-notes.create');
        Route::post('/panduan-kunjungan/catatan', [ConsultationNoteController::class, 'store'])->name('consultation-notes.store');
        Route::get('/panduan-kunjungan/catatan-tersimpan', [ConsultationNoteController::class, 'saved'])->name('consultation-notes.saved');
        Route::put('/panduan-kunjungan/catatan/{consultationNote}', [ConsultationNoteController::class, 'update'])->name('consultation-notes.update');
        Route::delete('/panduan-kunjungan/catatan/{consultationNote}', [ConsultationNoteController::class, 'destroy'])->name('consultation-notes.destroy');
        Route::get('/panduan-tindakan', [ConsultationNoteController::class, 'create'])->name('action-guide.show');

        // Kalender Kegiatan Posyandu & Tindak Lanjut (#21, #38)
        Route::get('/jadwal-posyandu', [ScheduleController::class, 'index'])->name('schedules.index');

        Route::inertia('/pengingat', 'OrangTua/NotifikasiPengingat')->name('notifications.index');

        // CRUD Profil Anak (#11)
        Route::get('/profil-anak', [ChildController::class, 'index'])->name('children.index');
        Route::get('/tambah-anak', [ChildController::class, 'create'])->name('children.create');
        Route::post('/profil-anak', [ChildController::class, 'store'])->name('children.store');
        Route::get('/profil-anak/konfirmasi', [ChildController::class, 'confirm'])->name('children.confirm');
        Route::put('/profil-anak/{child}', [ChildController::class, 'update'])->name('children.update');
        Route::delete('/profil-anak/{child}', [ChildController::class, 'destroy'])->name('children.destroy');

        // Jadwal & Riwayat Imunisasi (#18)
        Route::get('/imunisasi', [ImmunizationController::class, 'index'])->name('immunizations.index');
    });
