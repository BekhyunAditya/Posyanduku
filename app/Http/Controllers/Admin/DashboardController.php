<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\EducationArticle;
use App\Models\EducationCategory;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $pendingKadersQuery = User::query()
            ->where('role', UserRole::Kader)
            ->whereNull('kader_verified_at');

        $summary = [
            'total_users' => User::query()->count(),
            'total_parents' => User::query()->where('role', UserRole::OrangTua)->count(),
            'total_kaders' => User::query()->where('role', UserRole::Kader)->count(),
            'verified_kaders' => User::query()->where('role', UserRole::Kader)->whereNotNull('kader_verified_at')->count(),
            'pending_kaders' => (clone $pendingKadersQuery)->count(),
            'total_posyandus' => Posyandu::query()->count(),
            'active_posyandus' => Posyandu::query()->active()->count(),
            'total_articles' => EducationArticle::query()->count(),
            'published_articles' => EducationArticle::query()->published()->count(),
            'total_categories' => EducationCategory::query()->count(),
            'total_children_registered' => Child::query()->active()->count(),
        ];

        $pendingKaders = (clone $pendingKadersQuery)
            ->with('posyandu:id,name,code')
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'phone', 'posyandu_id', 'created_at']);

        $upcomingSchedules = PosyanduSchedule::query()
            ->published()
            ->upcoming()
            ->with('posyandu:id,name,code')
            ->limit(5)
            ->get(['id', 'posyandu_id', 'title', 'activity_type', 'scheduled_date', 'start_time', 'location']);

        $recentArticles = EducationArticle::query()
            ->with(['category:id,name,slug', 'author:id,name'])
            ->latest()
            ->limit(5)
            ->get(['id', 'education_category_id', 'author_id', 'title', 'slug', 'is_published', 'published_at']);

        return Inertia::render('Admin/DashboardAdmin', [
            'summary' => $summary,
            'pendingKaders' => $pendingKaders,
            'upcomingSchedules' => $upcomingSchedules,
            'recentArticles' => $recentArticles,
        ]);
    }
}
