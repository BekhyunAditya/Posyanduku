<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kader\StoreGrowthMeasurementRequest;
use App\Http\Requests\Kader\UpdateGrowthMeasurementRequest;
use App\Models\Child;
use App\Models\GrowthMeasurement;
use App\Services\GrowthChartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MeasurementController extends Controller
{
    public function __construct(
        private readonly GrowthChartService $growthChartService,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', GrowthMeasurement::class);

        $kader = $request->user();
        $childId = $request->integer('child_id') ?: null;

        $measurements = GrowthMeasurement::query()
            ->with(['child:id,name,nickname,gender,birth_date', 'kader:id,name'])
            ->whereHas('child', fn ($query) => $query->where('posyandu_id', $kader->posyandu_id))
            ->when($childId !== null, fn ($query) => $query->where('child_id', $childId))
            ->orderByDesc('measured_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        $children = Child::query()
            ->active()
            ->where('posyandu_id', $kader->posyandu_id)
            ->orderBy('name')
            ->get(['id', 'name', 'nickname', 'birth_date', 'gender'])
            ->map(fn (Child $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
                'gender' => $child->gender->value,
            ])
            ->all();

        return Inertia::render('Kader/DataBalita', [
            'measurements' => $measurements,
            'children' => $children,
            'filters' => [
                'child_id' => $childId,
            ],
        ]);
    }

    public function store(StoreGrowthMeasurementRequest $request, Child $child): RedirectResponse
    {
        $validated = $request->validated();

        $child->growthMeasurements()->create([
            'kader_id' => $request->user()->id,
            'measured_at' => $validated['measured_at'],
            'age_months' => $child->ageInMonths(Carbon::parse($validated['measured_at'])),
            'weight_kg' => $validated['weight_kg'],
            'height_cm' => $validated['height_cm'],
            'head_circumference_cm' => $validated['head_circumference_cm'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        $this->growthChartService->recalculateSeries($child);

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Hasil pengukuran balita berhasil dicatat.');
    }

    public function update(UpdateGrowthMeasurementRequest $request, Child $child, GrowthMeasurement $growthMeasurement): RedirectResponse
    {
        $validated = $request->validated();

        $growthMeasurement->update([
            'measured_at' => $validated['measured_at'],
            'weight_kg' => $validated['weight_kg'],
            'height_cm' => $validated['height_cm'],
            'head_circumference_cm' => $validated['head_circumference_cm'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        $this->growthChartService->recalculateSeries($child);

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Riwayat pengukuran balita berhasil diperbarui.');
    }

    public function destroy(Child $child, GrowthMeasurement $growthMeasurement): RedirectResponse
    {
        Gate::authorize('delete', $growthMeasurement);

        $growthMeasurement->delete();

        $this->growthChartService->recalculateSeries($child);

        return redirect()->route('kader.children.show', $child)
            ->with('status', 'Riwayat pengukuran balita berhasil dihapus.');
    }
}
