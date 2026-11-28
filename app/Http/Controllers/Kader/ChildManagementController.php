<?php

namespace App\Http\Controllers\Kader;

use App\Enums\Gender;
use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ChildManagementController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Child::class);

        $kader = $request->user();
        $search = $request->string('search')->trim()->toString();
        $genderParam = $request->string('gender')->trim()->toString();
        $ageGroup = $request->string('age_group')->trim()->toString();

        $normalizedGender = match (mb_strtolower($genderParam)) {
            'l', 'laki-laki' => Gender::Male->value,
            'p', 'perempuan' => Gender::Female->value,
            default => '',
        };

        $baseQuery = Child::query()
            ->active()
            ->where('posyandu_id', $kader->posyandu_id);

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'male' => (clone $baseQuery)->where('gender', Gender::Male)->count(),
            'female' => (clone $baseQuery)->where('gender', Gender::Female)->count(),
        ];

        $children = (clone $baseQuery)
            ->with(['parent:id,name,phone', 'posyandu:id,name,code', 'latestMeasurement'])
            ->when(
                $search !== '',
                fn ($query) => $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('nickname', 'like', "%{$search}%")
                        ->orWhereHas('parent', fn ($parentQuery) => $parentQuery->where('name', 'like', "%{$search}%"));
                })
            )
            ->when(
                $normalizedGender !== '',
                fn ($query) => $query->where('gender', $normalizedGender)
            )
            ->when(
                $ageGroup === '0-12',
                fn ($query) => $query->whereDate('birth_date', '>=', now()->subMonths(12)->toDateString())
            )
            ->when(
                $ageGroup === '13-24',
                fn ($query) => $query
                    ->whereDate('birth_date', '<', now()->subMonths(12)->toDateString())
                    ->whereDate('birth_date', '>=', now()->subMonths(24)->toDateString())
            )
            ->when(
                $ageGroup === '25+',
                fn ($query) => $query->whereDate('birth_date', '<', now()->subMonths(24)->toDateString())
            )
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'birth_date' => $child->birth_date->toDateString(),
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
                'gender' => $child->gender->value,
                'gender_label' => $child->gender->label(),
                'parent' => $child->parent?->only(['id', 'name', 'phone']),
                'posyandu' => $child->posyandu?->only(['id', 'name', 'code']),
                'latest_measurement' => $child->latestMeasurement,
            ]);

        return Inertia::render('Kader/DataBalita', [
            'children' => $children,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'gender' => $normalizedGender,
                'age_group' => $ageGroup,
            ],
        ]);
    }

    public function show(Child $child): Response
    {
        Gate::authorize('view', $child);

        $child->load([
            'parent:id,name,email,phone',
            'posyandu:id,name,code,address',
            'growthMeasurements' => fn ($query) => $query->with('kader:id,name')->orderByDesc('measured_at'),
            'visits' => fn ($query) => $query->with(['kader:id,name', 'schedule:id,title,scheduled_date'])->orderByDesc('visited_at'),
            'immunizations' => fn ($query) => $query->with('schedule:id,code,name,target_age_months,age_label'),
        ]);

        return Inertia::render('Kader/DetailBalitaKader', [
            'childId' => $child->id,
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'birth_date' => $child->birth_date->toDateString(),
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
                'gender' => $child->gender->value,
                'gender_label' => $child->gender->label(),
                'birth_weight_kg' => $child->birth_weight_kg,
                'birth_height_cm' => $child->birth_height_cm,
                'blood_type' => $child->blood_type,
                'notes' => $child->notes,
                'parent' => $child->parent?->only(['id', 'name', 'email', 'phone']),
                'posyandu' => $child->posyandu?->only(['id', 'name', 'code', 'address']),
                'growth_measurements' => $child->growthMeasurements,
                'visits' => $child->visits,
                'immunizations' => $child->immunizations,
            ],
        ]);
    }
}
