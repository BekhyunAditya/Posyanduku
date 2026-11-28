<?php

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
        Route::inertia('/panduan-kunjungan/catatan', 'OrangTua/CatatanKonsultasi')->name('consultation-notes.create');
        Route::inertia('/panduan-kunjungan/catatan-tersimpan', 'OrangTua/CatatanTersimpan')->name('consultation-notes.saved');
        Route::inertia('/panduan-tindakan', 'OrangTua/CatatanKonsultasi')->name('action-guide.show');
        Route::inertia('/jadwal-posyandu', 'OrangTua/KalenderPosyandu')->name('schedules.index');
        Route::inertia('/pengingat', 'OrangTua/NotifikasiPengingat')->name('notifications.index');
        Route::inertia('/profil-anak', 'OrangTua/ProfilAnak')->name('children.index');
        Route::inertia('/tambah-anak', 'OrangTua/TambahProfilAnak')->name('children.create');
        Route::inertia('/profil-anak/konfirmasi', 'OrangTua/KonfirmasiPenyimpanan')->name('children.confirm');
        Route::inertia('/imunisasi', 'OrangTua/JadwalImunisasi')->name('immunizations.index');
    });
