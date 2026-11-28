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

require __DIR__.'/ortu.php';
require __DIR__.'/kader.php';
require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
