<?php

namespace App\Http\Controllers\Ortu;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Services\GrowthChartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class GrowthController extends Controller
{
    public function __construct(
        private readonly GrowthChartService $growthChartService,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Child::class);

        $children = $request->user()
            ->children()
            ->active()
            ->orderBy('name')
            ->get();

        $requestedChildId = $request->integer('child_id') ?: null;
        $selectedChild = $requestedChildId !== null
            ? $children->firstWhere('id', $requestedChildId)
            : $children->first();

        if ($selectedChild === null && $children->isNotEmpty()) {
            $selectedChild = $children->first();
        }

        if ($selectedChild !== null) {
            Gate::authorize('view', $selectedChild);
        }

        return Inertia::render('OrangTua/PantauPertumbuhan', [
            'children' => $children->map(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'gender' => $child->gender->value,
                'gender_label' => $child->gender->label(),
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
            ])->values()->all(),
            'selectedChildId' => $selectedChild?->id,
            'growth' => $selectedChild !== null
                ? $this->growthChartService->buildChartPayload($selectedChild)
                : null,
        ]);
    }
}
