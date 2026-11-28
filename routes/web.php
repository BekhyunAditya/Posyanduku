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

// Panel Orang Tua
Route::prefix('ortu')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('OrangTua/DashboardOrtu'));
    Route::get('/pertumbuhan', fn() => Inertia::render('OrangTua/PantauPertumbuhan'));
    Route::get('/buku-kia', fn() => Inertia::render('OrangTua/BukuKiaDigital'));
    Route::get('/panduan-kunjungan', fn() => Inertia::render('OrangTua/PanduanKunjungan'));
    Route::get('/panduan-kunjungan/catatan', fn() => Inertia::render('OrangTua/CatatanKonsultasi'));
    Route::post('/panduan-kunjungan/catatan-tersimpan', function (Request $request) {
        $request->session()->flash('savedNote',$request->all());
        return redirect('/ortu/panduan-kunjungan/catatan-tersimpan');
    });
    Route::get('/panduan-kunjungan/catatan-tersimpan', function () {
        return Inertia::render('OrangTua/CatatanTersimpan', ['savedNote' => session('savedNote')]);
    });
    Route::get('/panduan-tindakan', fn() => Inertia::render('OrangTua/PanduanTindakanPersonal'));
    Route::get('/jadwal-posyandu', fn() => Inertia::render('OrangTua/KalenderPosyandu'));
    Route::get('/pengingat', fn() => Inertia::render('OrangTua/NotifikasiPengingat'));
    Route::get('/profil-anak', fn() => Inertia::render('OrangTua/ProfilAnak'));
    Route::get('/tambah-anak', fn() => Inertia::render('OrangTua/TambahProfilAnak'));
    Route::post('/profil-anak/konfirmasi', function (Request $request) {
        $request->session()->flash('savedChild',$request->all());
        return redirect('/ortu/profil-anak/konfirmasi');
    });
    Route::get('/profil-anak/konfirmasi', function () {
        return Inertia::render('OrangTua/KonfirmasiPenyimpanan', ['savedChild' => session('savedChild')]);
    });
    Route::get('/imunisasi', fn() => Inertia::render('OrangTua/JadwalImunisasi'));
});

// Panel Kader Posyandu
Route::prefix('kader')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Kader/DashboardKader'));
    Route::get('/data-balita', fn() => Inertia::render('Kader/DataBalita'));
    Route::get('/data-balita/tambah', fn() => Inertia::render('Kader/TambahBalita'));
    Route::get('/data-balita/{slug}', fn(string $slug) => Inertia::render('Kader/DetailBalita', ['slug' =>$slug]));
    Route::get('/pengukuran', fn() => Inertia::render('Kader/CatatPengukuran'));
    Route::get('/pelayanan', fn() => Inertia::render('Kader/PelayananVerifikasi'));
    Route::get('/jadwal-kegiatan', fn() => Inertia::render('Kader/JadwalKegiatan'));
    Route::get('/jadwal-kegiatan/tambah', fn() => Inertia::render('Kader/TambahKegiatan'));
    Route::get('/jadwal-kegiatan/kunjungan', fn() => Inertia::render('Kader/HasilKunjungan'));
    Route::get('/tindak-lanjut', fn() => Inertia::render('Kader/TindakLanjut'));
    Route::get('/tindak-lanjut/tambah', fn() => Inertia::render('Kader/TambahTindakLanjut'));
    Route::get('/tindak-lanjut/{slug}', fn(string $slug) => Inertia::render('Kader/DetailTindakLanjut', ['slug' =>$slug]));
});

Route::prefix('admin')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Admin/DashboardAdmin'))->name('admin.dashboard');
    Route::get('/ringkasan', fn () => Inertia::render('Admin/DashboardAdmin'))->name('admin.ringkasan');
    Route::get('/akun', fn () => Inertia::render('Admin/KelolaPengguna'))->name('admin.akun');
    Route::get('/akun/aturan-peran', fn () => Inertia::render('Admin/AturanPeran'))->name('admin.akun.aturan');
    Route::get('/akun/tambah', fn () => Inertia::render('Admin/TambahAkunKader'))->name('admin.akun.tambah');
    Route::get('/akun/konfirmasi', fn () => Inertia::render('Admin/KonfirmasiAkunKader'))->name('admin.akun.konfirmasi');
    Route::get('/posyandu', fn () => Inertia::render('Admin/KelolaPosyandu'))->name('admin.posyandu');
    Route::get('/posyandu/form', fn () => Inertia::render('Admin/FormPosyandu'))->name('admin.posyandu.create');
    Route::get('/posyandu/ubah/{slug}', fn ($slug) => Inertia::render('Admin/FormPosyandu', ['slug' => $slug]))->name('admin.posyandu.edit');
    Route::get('/posyandu/konfirmasi', fn () => Inertia::render('Admin/KonfirmasiPosyandu'))->name('admin.posyandu.konfirmasi');
    Route::get('/edukasi', fn () => Inertia::render('Admin/KelolaEdukasi'))->name('admin.edukasi');
    Route::get('/edukasi/tulis', fn () => Inertia::render('Admin/FormArtikel'))->name('admin.edukasi.create');
    Route::get('/edukasi/sunting/{slug}', fn ($slug) => Inertia::render('Admin/FormArtikel', ['slug' => $slug]))->name('admin.edukasi.edit');
    Route::get('/edukasi/konfirmasi/{slug}', fn ($slug) => Inertia::render('Admin/KonfirmasiArtikel', ['slug' => $slug]))->name('admin.edukasi.konfirmasi');
    Route::get('/kategori-edukasi', fn () => Inertia::render('Admin/KategoriEdukasi'))->name('admin.kategori');
    Route::get('/kategori-edukasi/konfirmasi', fn () => Inertia::render('Admin/KonfirmasiKategoriEdukasi'))->name('admin.kategori.konfirmasi');
    Route::get('/pengaturan', fn () => Inertia::render('Admin/PengaturanSistem'))->name('admin.pengaturan');
    Route::get('/pengaturan/konfirmasi', fn () => Inertia::render('Admin/KonfirmasiPengaturan'))->name('admin.pengaturan.konfirmasi');
});

require __DIR__ . '/auth.php';