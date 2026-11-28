<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEducationArticleRequest;
use App\Http\Requests\Admin\UpdateEducationArticleRequest;
use App\Models\EducationArticle;
use App\Models\EducationCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EducationArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $categoryId = $request->integer('category_id');
        $status = $request->string('status')->toString();
        $search = $request->string('search')->trim()->toString();

        $articles = EducationArticle::query()
            ->with(['category:id,name,slug', 'author:id,name'])
            ->when($categoryId > 0, fn ($query) => $query->where('education_category_id', $categoryId))
            ->when($status === 'published', fn ($query) => $query->where('is_published', true))
            ->when($status === 'draft', fn ($query) => $query->where('is_published', false))
            ->when(
                $search !== '',
                fn ($query) => $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                })
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $categories = EducationCategory::query()
            ->withCount('articles')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/KelolaEdukasi', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => [
                'category_id' => $categoryId > 0 ? $categoryId : null,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function store(StoreEducationArticleRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $isPublished = (bool) ($validated['is_published'] ?? true);
        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : $this->generateUniqueSlug($validated['title']);

        EducationArticle::query()->create([
            'education_category_id' => $validated['education_category_id'],
            'author_id' => $request->user()->id,
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'thumbnail_url' => $validated['thumbnail_url'] ?? null,
            'min_age_months' => $validated['min_age_months'],
            'max_age_months' => $validated['max_age_months'],
            'reading_time_minutes' => $validated['reading_time_minutes'] ?? 3,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'is_published' => $isPublished,
            'published_at' => $isPublished ? now() : null,
        ]);

        return redirect()->route('admin.education.index')
            ->with('status', 'Artikel edukasi berhasil ditambahkan.');
    }

    public function update(UpdateEducationArticleRequest $request, EducationArticle $article): RedirectResponse
    {
        $validated = $request->validated();
        $isPublished = array_key_exists('is_published', $validated)
            ? (bool) $validated['is_published']
            : $article->is_published;

        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : $this->generateUniqueSlug($validated['title'], $article->id);

        $article->update([
            'education_category_id' => $validated['education_category_id'],
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'thumbnail_url' => $validated['thumbnail_url'] ?? null,
            'min_age_months' => $validated['min_age_months'],
            'max_age_months' => $validated['max_age_months'],
            'reading_time_minutes' => $validated['reading_time_minutes'] ?? $article->reading_time_minutes,
            'is_featured' => array_key_exists('is_featured', $validated)
                ? (bool) $validated['is_featured']
                : $article->is_featured,
            'is_published' => $isPublished,
            'published_at' => $isPublished ? ($article->published_at ?? now()) : null,
        ]);

        return redirect()->route('admin.education.index')
            ->with('status', 'Artikel edukasi berhasil diperbarui.');
    }

    public function destroy(EducationArticle $article): RedirectResponse
    {
        $article->delete();

        return redirect()->route('admin.education.index')
            ->with('status', 'Artikel edukasi berhasil dihapus.');
    }

    private function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 2;

        while (
            EducationArticle::query()
                ->where('slug', $slug)
                ->when($ignoreId !== null, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
