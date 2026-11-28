<?php

namespace App\Http\Controllers\Ortu;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Services\ImmunizationTrackerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ImmunizationController extends Controller
{
    public function __construct(
        private readonly ImmunizationTrackerService $immunizationTrackerService,
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

        return Inertia::render('OrangTua/JadwalImunisasi', [
            'children' => $children->map(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
            ])->values()->all(),
            'selectedChildId' => $selectedChild?->id,
            'immunization' => $selectedChild !== null
                ? $this->immunizationTrackerService->buildSummaryForChild($selectedChild)
                : null,
        ]);
    }
}
