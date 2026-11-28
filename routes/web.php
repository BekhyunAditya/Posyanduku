<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

// ========================================
// HALAMAN PUBLIK
// ========================================
Route::inertia('/', 'LandingPage')->name('home');
Route::inertia('/edukasi', 'OrangTua/EdukasiArtikel')->name('edukasi.index');
Route::get('/edukasi/{slug}', fn (string $slug): Response => Inertia::render('OrangTua/DetailEdukasi', [
    'slug' => $slug,
]))->name('edukasi.show');

// Pengalihan dashboard sesuai peran pengguna
Route::get('/dashboard', function (Request $request): RedirectResponse {
    return redirect()->route($request->user()->dashboardRoute());
})->middleware(['auth', 'verified'])->name('dashboard');

// Profil pengguna terautentikasi
Route::middleware('auth')->group(function (): void {
    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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

require __DIR__.'/auth.php';
