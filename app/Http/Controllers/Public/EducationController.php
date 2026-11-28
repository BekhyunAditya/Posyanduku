<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\EducationArticle;
use App\Models\EducationCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EducationController extends Controller
{
    public function index(Request $request): Response
    {
        $topic = $request->string('topik')->trim()->toString();
        $categoryFilter = $topic !== '' ? $topic : $request->string('kategori')->trim()->toString();
        $search = $request->string('q')->trim()->toString();

        $ageMonths = $request->filled('usia_bulan')
            ? max(0, min(60, $request->integer('usia_bulan')))
            : null;

        $selectedChildId = $request->integer('child_id') ?: null;
        $user = $request->user();
        $children = [];

        if ($user !== null && $user->isOrangTua()) {
            $children = $user->children()
                ->active()
                ->orderBy('name')
                ->get(['id', 'name', 'nickname', 'birth_date'])
                ->map(fn (Child $child): array => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'nickname' => $child->nickname,
                    'age_months' => $child->ageInMonths(),
                    'age_label' => $child->ageLabel(),
                ])
                ->all();

            if ($ageMonths === null && $selectedChildId !== null) {
                $ownedChild = $user->children()->active()->find($selectedChildId);

                if ($ownedChild !== null) {
                    $ageMonths = $ownedChild->ageInMonths();
                }
            }
        }

        $articlesQuery = EducationArticle::query()
            ->published()
            ->with('category:id,name,slug')
            ->when(
                $categoryFilter !== '' && strcasecmp($categoryFilter, 'Semua Topik') !== 0,
                fn ($query) => $query->whereHas('category', function ($categoryQuery) use ($categoryFilter): void {
                    $normalized = mb_strtolower($categoryFilter);
                    $categoryQuery->where('slug', $categoryFilter)
                        ->orWhereRaw('LOWER(name) = ?', [$normalized]);
                })
            )
            ->when(
                $ageMonths !== null,
                fn ($query) => $query->forAgeMonths($ageMonths)
            )
            ->when(
                $search !== '',
                fn ($query) => $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                })
            )
            ->orderByDesc('is_featured')
            ->latest('published_at');

        $articles = $articlesQuery->get();
        $featuredArticle = $articles->firstWhere('is_featured', true) ?? $articles->first();

        return Inertia::render('OrangTua/EdukasiArtikel', [
            'articles' => $articles,
            'featuredArticle' => $featuredArticle,
            'categories' => EducationCategory::query()->activeOrdered()->get(['id', 'name', 'slug', 'description']),
            'children' => $children,
            'filters' => [
                'topik' => $categoryFilter !== '' ? $categoryFilter : 'Semua Topik',
                'usia_bulan' => $ageMonths,
                'child_id' => $selectedChildId,
                'q' => $search,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $article = EducationArticle::query()
            ->published()
            ->with('category:id,name,slug')
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedArticles = EducationArticle::query()
            ->published()
            ->with('category:id,name,slug')
            ->where('education_category_id', $article->education_category_id)
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->limit(3)
            ->get();

        return Inertia::render('OrangTua/DetailEdukasi', [
            'slug' => $article->slug,
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'categories' => EducationCategory::query()->activeOrdered()->get(['id', 'name', 'slug']),
        ]);
    }
}
