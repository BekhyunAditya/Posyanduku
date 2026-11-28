<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman utama
Route::get('/', fn() => Inertia::render('LandingPage'));

Route::get('/edukasi', fn() => Inertia::render('OrangTua/EdukasiArtikel'));
Route::get('/edukasi/{slug}', fn(string $slug) => Inertia::render('OrangTua/DetailEdukasi', ['slug' => $slug]));

// Dashboard bawaan Laravel
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profil pengguna bawaan Laravel
Route::middleware('auth')->group(function () {
    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ========================================
// HALAMAN ORANG TUA
// ========================================

Route::prefix('ortu')->group(function () {
    // Dashboard
    Route::get('/dashboard', fn() => Inertia::render('OrangTua/DashboardOrtu'));

    // Halaman Panduan Tindakan Personal
    Route::get('/panduan-tindakan', fn() => Inertia::render('OrangTua/PanduanTindakanPersonal'));

    // Pertumbuhan anak
    Route::get('/pertumbuhan', fn() => Inertia::render('OrangTua/PantauPertumbuhan'));

    // Buku KIA
    Route::get('/buku-kia', fn() => Inertia::render('OrangTua/BukuKiaDigital'));

    // Panduan kunjungan
    Route::get('/panduan-kunjungan', fn() => Inertia::render('OrangTua/PanduanKunjungan'));

    // Form catatan konsultasi
    Route::get('/panduan-kunjungan/catatan', fn() => Inertia::render('OrangTua/CatatanKonsultasi'));

    // Menyimpan catatan konsultasi ke session
    Route::post('/panduan-kunjungan/catatan-tersimpan', function (Request $request) {
        $request->session()->flash('savedNote', $request->all());

        return redirect('/ortu/panduan-kunjungan/catatan-tersimpan');
    });

    // Halaman catatan tersimpan
    Route::get('/panduan-kunjungan/catatan-tersimpan', function () {
        return Inertia::render('OrangTua/CatatanTersimpan', [
            'savedNote' => session('savedNote'),
        ]);
    });


    // Jadwal Posyandu
    Route::get('/jadwal-posyandu', fn() => Inertia::render('OrangTua/KalenderPosyandu'));

    // Pengingat
    Route::get('/pengingat', fn() => Inertia::render('OrangTua/NotifikasiPengingat'));

    // Profil anak
    Route::get('/profil-anak', fn() => Inertia::render('OrangTua/ProfilAnak'));

    // Tambah profil anak
    Route::get('/tambah-anak', fn() => Inertia::render('OrangTua/TambahProfilAnak'));

    // Menerima data profil anak dari form edit atau tambah
    Route::post('/profil-anak/konfirmasi', function (Request $request) {
        $request->session()->flash('savedChild', $request->all());

        return redirect('/ortu/profil-anak/konfirmasi');
    });

    // Halaman konfirmasi profil anak
    Route::get('/profil-anak/konfirmasi', function () {
        return Inertia::render('OrangTua/KonfirmasiPenyimpanan', [
            'savedChild' => session('savedChild'),
        ]);
    });

    // Imunisasi
    Route::get('/imunisasi', fn() => Inertia::render('OrangTua/JadwalImunisasi'));
});

// ========================================
// PANEL KADER POSYANDU
// ========================================

Route::prefix('kader')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Kader/DashboardKader'));
    Route::get('/data-balita', fn() => Inertia::render('Kader/DataBalita'));
    Route::get('/data-balita/tambah', fn() => Inertia::render('Kader/TambahBalita'));
    Route::get('/data-balita/{slug}', fn(string $slug) => Inertia::render('Kader/DetailBalita', ['slug' => $slug]));
    Route::get('/pengukuran', fn() => Inertia::render('Kader/CatatPengukuran'));
    Route::get('/pelayanan', fn() => Inertia::render('Kader/PelayananVerifikasi'));
    Route::get('/jadwal-kegiatan', fn() => Inertia::render('Kader/JadwalKegiatan'));
    Route::get('/jadwal-kegiatan/tambah', fn() => Inertia::render('Kader/TambahKegiatan'));
    Route::get('/jadwal-kegiatan/kunjungan', fn() => Inertia::render('Kader/HasilKunjungan'));
});

require __DIR__ . '/auth.php';