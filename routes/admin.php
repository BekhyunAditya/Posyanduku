<?php

use App\Http\Controllers\Admin\EducationArticleController;
use App\Http\Controllers\Admin\EducationCategoryController;
use App\Http\Controllers\Admin\PosyanduController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;

// ========================================
// HALAMAN ADMIN
// ========================================
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::inertia('/dashboard', 'Admin/DashboardAdmin')->name('dashboard');

        // Kelola Pengguna & Verifikasi Kader (#28)
        Route::get('/pengguna', [UserManagementController::class, 'index'])->name('users.index');
        Route::post('/pengguna', [UserManagementController::class, 'store'])->name('users.store');
        Route::patch('/pengguna/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::patch('/pengguna/{user}/verifikasi-kader', [UserManagementController::class, 'verifyKader'])->name('users.verify-kader');
        Route::delete('/pengguna/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');

        // Kelola Data Posyandu (#29)
        Route::get('/posyandu', [PosyanduController::class, 'index'])->name('posyandus.index');
        Route::post('/posyandu', [PosyanduController::class, 'store'])->name('posyandus.store');
        Route::put('/posyandu/{posyandu}', [PosyanduController::class, 'update'])->name('posyandus.update');
        Route::delete('/posyandu/{posyandu}', [PosyanduController::class, 'destroy'])->name('posyandus.destroy');

        // Kelola Artikel & Kategori Edukasi (#23)
        Route::get('/edukasi', [EducationArticleController::class, 'index'])->name('education.index');
        Route::post('/edukasi/artikel', [EducationArticleController::class, 'store'])->name('education.articles.store');
        Route::put('/edukasi/artikel/{article}', [EducationArticleController::class, 'update'])->name('education.articles.update');
        Route::delete('/edukasi/artikel/{article}', [EducationArticleController::class, 'destroy'])->name('education.articles.destroy');
        Route::post('/edukasi/kategori', [EducationCategoryController::class, 'store'])->name('education.categories.store');
        Route::put('/edukasi/kategori/{category}', [EducationCategoryController::class, 'update'])->name('education.categories.update');
        Route::delete('/edukasi/kategori/{category}', [EducationCategoryController::class, 'destroy'])->name('education.categories.destroy');

        // Pengaturan Sistem (#30)
        Route::get('/pengaturan', [SettingController::class, 'index'])->name('settings.index');
        Route::patch('/pengaturan', [SettingController::class, 'update'])->name('settings.update');
    });
