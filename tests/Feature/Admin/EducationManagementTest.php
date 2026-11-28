<?php

use App\Models\EducationArticle;
use App\Models\EducationCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows admin to manage education categories and articles', function () {
    $admin = User::factory()->admin()->create();

    // Create category
    $this->actingAs($admin)
        ->post(route('admin.education.categories.store'), [
            'name' => 'Gizi Seimbang Balita',
            'description' => 'Panduan gizi seimbang harian.',
            'sort_order' => 1,
        ])
        ->assertRedirect(route('admin.education.index'));

    $category = EducationCategory::query()->where('slug', 'gizi-seimbang-balita')->firstOrFail();

    // Create article
    $this->actingAs($admin)
        ->post(route('admin.education.articles.store'), [
            'education_category_id' => $category->id,
            'title' => 'Tips Menyusun Menu Harian Balita',
            'excerpt' => 'Ringkasan menyusun menu padat gizi.',
            'content' => 'Konten lengkap tentang menu harian balita.',
            'min_age_months' => 12,
            'max_age_months' => 36,
            'reading_time_minutes' => 4,
            'is_featured' => true,
            'is_published' => true,
        ])
        ->assertRedirect(route('admin.education.index'));

    $article = EducationArticle::query()->where('slug', 'tips-menyusun-menu-harian-balita')->firstOrFail();
    expect($article->author_id)->toBe($admin->id)
        ->and($article->published_at)->not->toBeNull();

    // Admin index renders articles and categories
    $this->actingAs($admin)
        ->get(route('admin.education.index', ['category_id' => $category->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/KelolaEdukasi')
            ->has('articles.data', 1)
            ->has('categories', 1)
        );

    // Cannot delete category while it still has articles
    $this->actingAs($admin)
        ->delete(route('admin.education.categories.destroy', $category))
        ->assertSessionHasErrors('category');

    // Update article to draft
    $this->actingAs($admin)
        ->put(route('admin.education.articles.update', $article), [
            'education_category_id' => $category->id,
            'title' => 'Tips Menyusun Menu Harian Balita Revisi',
            'content' => 'Konten revisi.',
            'min_age_months' => 12,
            'max_age_months' => 48,
            'is_published' => false,
        ])
        ->assertRedirect(route('admin.education.index'));

    expect($article->fresh()->is_published)->toBeFalse()
        ->and($article->fresh()->published_at)->toBeNull();

    // Delete article then delete empty category
    $this->actingAs($admin)
        ->delete(route('admin.education.articles.destroy', $article))
        ->assertRedirect(route('admin.education.index'));

    $this->actingAs($admin)
        ->delete(route('admin.education.categories.destroy', $category))
        ->assertRedirect(route('admin.education.index'));

    $this->assertDatabaseMissing('education_articles', ['id' => $article->id]);
    $this->assertDatabaseMissing('education_categories', ['id' => $category->id]);
});

it('validates age range on education articles and blocks non-admin access', function () {
    $admin = User::factory()->admin()->create();
    $parent = User::factory()->orangTua()->create();
    $category = EducationCategory::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.education.articles.store'), [
            'education_category_id' => $category->id,
            'title' => 'Artikel Rentang Usia Salah',
            'content' => 'Isi artikel.',
            'min_age_months' => 24,
            'max_age_months' => 12,
        ])
        ->assertSessionHasErrors('max_age_months');

    $this->actingAs($parent)
        ->post(route('admin.education.articles.store'), [])
        ->assertForbidden();
});
