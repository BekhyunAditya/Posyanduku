<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\EducationController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ========================================
// HALAMAN PUBLIK
// ========================================
Route::inertia('/', 'LandingPage')->name('home');
Route::get('/edukasi', [EducationController::class, 'index'])->name('edukasi.index');
Route::get('/edukasi/{slug}', [EducationController::class, 'show'])->name('edukasi.show');

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
