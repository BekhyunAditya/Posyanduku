<?php

use App\Models\Child;
use App\Models\EducationArticle;
use App\Models\EducationCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('filters published education articles by category, search, and child age', function () {
    $asiCategory = EducationCategory::factory()->create(['name' => 'ASI dan Pemberian Makan Bayi', 'slug' => 'asi']);
    $mpasiCategory = EducationCategory::factory()->create(['name' => 'MPASI', 'slug' => 'mpasi']);

    $asiArticle = EducationArticle::factory()->create([
        'education_category_id' => $asiCategory->id,
        'title' => 'Panduan ASI Eksklusif',
        'slug' => 'panduan-asi-eksklusif',
        'min_age_months' => 0,
        'max_age_months' => 6,
        'is_published' => true,
    ]);
    $mpasiArticle = EducationArticle::factory()->create([
        'education_category_id' => $mpasiCategory->id,
        'title' => 'Menu MPASI 9 Bulan',
        'slug' => 'menu-mpasi-9-bulan',
        'min_age_months' => 6,
        'max_age_months' => 24,
        'is_published' => true,
    ]);
    EducationArticle::factory()->create([
        'education_category_id' => $mpasiCategory->id,
        'title' => 'Draft MPASI Rahasia',
        'slug' => 'draft-mpasi-rahasia',
        'min_age_months' => 6,
        'max_age_months' => 24,
        'is_published' => false,
    ]);

    // Filter by category slug (draft excluded)
    $this->get(route('edukasi.index', ['topik' => 'mpasi']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/EdukasiArtikel')
            ->has('articles', 1)
            ->where('articles.0.slug', $mpasiArticle->slug)
        );

    // Filter by explicit age in months (3 months -> only ASI article)
    $this->get(route('edukasi.index', ['usia_bulan' => 3]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('articles', 1)
            ->where('articles.0.slug', $asiArticle->slug)
        );

    // Filter automatically by owned child_id for authenticated parent
    $parent = User::factory()->orangTua()->create();
    $otherParent = User::factory()->orangTua()->create();

    $toddler = Child::factory()->create([
        'parent_id' => $parent->id,
        'birth_date' => now()->subMonths(12)->toDateString(),
    ]);
    $otherBaby = Child::factory()->create([
        'parent_id' => $otherParent->id,
        'birth_date' => now()->subMonths(2)->toDateString(),
    ]);

    $this->actingAs($parent)
        ->get(route('edukasi.index', ['child_id' => $toddler->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.usia_bulan', 12)
            ->has('articles', 1)
            ->where('articles.0.slug', $mpasiArticle->slug)
        );

    // Passing another parent's child_id does not leak age filter
    $this->actingAs($parent)
        ->get(route('edukasi.index', ['child_id' => $otherBaby->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.usia_bulan', null)
            ->has('articles', 2)
        );
});

it('shows published article detail and returns 404 for draft or missing articles', function () {
    $category = EducationCategory::factory()->create();
    $published = EducationArticle::factory()->create([
        'education_category_id' => $category->id,
        'slug' => 'artikel-terbit',
        'is_published' => true,
    ]);
    $draft = EducationArticle::factory()->create([
        'education_category_id' => $category->id,
        'slug' => 'artikel-draft',
        'is_published' => false,
    ]);

    $this->get(route('edukasi.show', $published->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/DetailEdukasi')
            ->where('slug', $published->slug)
            ->where('article.id', $published->id)
        );

    $this->get(route('edukasi.show', $draft->slug))->assertNotFound();
    $this->get(route('edukasi.show', 'tidak-ada'))->assertNotFound();
});
