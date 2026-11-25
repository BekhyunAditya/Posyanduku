
<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman utama
Route::get('/', function () {
    return redirect('/login');
});

// Dashboard bawaan Laravel
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profil pengguna bawaan Laravel
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ========================================
// HALAMAN ORANG TUA
// ========================================

Route::prefix('ortu')->group(function () {
    // Dashboard
    Route::get('/dashboard', fn () => Inertia::render('OrangTua/DashboardOrtu'));

    // Pertumbuhan anak
    Route::get('/pertumbuhan', fn () => Inertia::render('OrangTua/PantauPertumbuhan'));

    // Buku KIA
    Route::get('/buku-kia', fn () => Inertia::render('OrangTua/BukuKiaDigital'));

    // Panduan kunjungan
    Route::get('/panduan-kunjungan', fn () => Inertia::render('OrangTua/PanduanKunjungan'));

    // Form catatan konsultasi
    Route::get('/panduan-kunjungan/catatan', fn () => Inertia::render('OrangTua/CatatanKonsultasi'));

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

    // Alias panduan tindakan
    Route::get('/panduan-tindakan', fn () => Inertia::render('OrangTua/CatatanKonsultasi'));

    // Jadwal Posyandu
    Route::get('/jadwal-posyandu', fn () => Inertia::render('OrangTua/KalenderPosyandu'));

    // Pengingat
    Route::get('/pengingat', fn () => Inertia::render('OrangTua/NotifikasiPengingat'));

    // Profil anak
    Route::get('/profil-anak', fn () => Inertia::render('OrangTua/ProfilAnak'));

    // Tambah profil anak
    Route::get('/tambah-anak', fn () => Inertia::render('OrangTua/TambahProfilAnak'));

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
    Route::get('/imunisasi', fn () => Inertia::render('OrangTua/JadwalImunisasi'));

});

require __DIR__.'/auth.php';
