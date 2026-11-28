<?php

namespace App\Http\Controllers\Ortu;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ortu\StoreChildRequest;
use App\Http\Requests\Ortu\UpdateChildRequest;
use App\Models\Child;
use App\Models\Posyandu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ChildController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Child::class);

        $children = $request->user()
            ->children()
            ->with(['posyandu:id,name,code', 'latestMeasurement'])
            ->orderBy('name')
            ->get()
            ->map(fn (Child $child): array => $this->formatChild($child))
            ->all();

        $selectedChildId = $request->integer('child_id') ?: null;
        $selectedChild = collect($children)->firstWhere('id', $selectedChildId) ?? ($children[0] ?? null);

        return Inertia::render('OrangTua/ProfilAnak', [
            'children' => $children,
            'selectedChild' => $selectedChild,
            'posyandus' => Posyandu::query()->active()->orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Child::class);

        return Inertia::render('OrangTua/TambahProfilAnak', [
            'posyandus' => Posyandu::query()->active()->orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    public function store(StoreChildRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $posyanduId = $this->resolvePosyanduId($validated, $request->user()->posyandu_id);

        $child = $request->user()->children()->create([
            'posyandu_id' => $posyanduId,
            'name' => $validated['name'],
            'nickname' => $validated['nickname'] ?: explode(' ', trim($validated['name']))[0],
            'nik' => $validated['nik'] ?? null,
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'birth_weight_kg' => $validated['birth_weight_kg'] ?? null,
            'birth_height_cm' => $validated['birth_height_cm'] ?? null,
            'blood_type' => $validated['blood_type'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'is_active' => true,
        ]);

        if ($posyanduId !== null && $request->user()->posyandu_id === null) {
            $request->user()->update(['posyandu_id' => $posyanduId]);
        }

        $child->load('posyandu:id,name,code');

        return redirect()->route('ortu.children.confirm')
            ->with('savedChild', $this->formatChild($child))
            ->with('status', 'Profil anak berhasil ditambahkan.');
    }

    public function confirm(Request $request): Response
    {
        $savedChild = $request->session()->get('savedChild');

        if ($savedChild === null) {
            $latestChild = $request->user()
                ->children()
                ->with('posyandu:id,name,code')
                ->latest()
                ->first();

            $savedChild = $latestChild !== null ? $this->formatChild($latestChild) : null;
        }

        return Inertia::render('OrangTua/KonfirmasiPenyimpanan', [
            'savedChild' => $savedChild,
        ]);
    }

    public function update(UpdateChildRequest $request, Child $child): RedirectResponse
    {
        $validated = $request->validated();
        $posyanduId = $this->resolvePosyanduId($validated, $child->posyandu_id);

        $child->update([
            'posyandu_id' => $posyanduId,
            'name' => $validated['name'],
            'nickname' => $validated['nickname'] ?: explode(' ', trim($validated['name']))[0],
            'nik' => $validated['nik'] ?? null,
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'birth_weight_kg' => $validated['birth_weight_kg'] ?? null,
            'birth_height_cm' => $validated['birth_height_cm'] ?? null,
            'blood_type' => $validated['blood_type'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        $child->load('posyandu:id,name,code');

        return redirect()->route('ortu.children.confirm')
            ->with('savedChild', $this->formatChild($child))
            ->with('status', 'Profil anak berhasil diperbarui.');
    }

    public function destroy(Child $child): RedirectResponse
    {
        Gate::authorize('delete', $child);

        $child->delete();

        return redirect()->route('ortu.children.index')
            ->with('status', 'Profil anak berhasil dihapus.');
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function resolvePosyanduId(array $validated, ?int $fallbackPosyanduId): ?int
    {
        if (! empty($validated['posyandu_id'])) {
            return (int) $validated['posyandu_id'];
        }

        if (! empty($validated['posyandu_code'])) {
            return Posyandu::query()
                ->active()
                ->where('code', $validated['posyandu_code'])
                ->value('id');
        }

        return $fallbackPosyanduId;
    }

    /**
     * @return array<string, mixed>
     */
    private function formatChild(Child $child): array
    {
        return [
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
            'is_active' => $child->is_active,
            'posyandu_id' => $child->posyandu_id,
            'posyandu' => $child->posyandu?->only(['id', 'name', 'code']),
            'latest_measurement' => $child->relationLoaded('latestMeasurement') ? $child->latestMeasurement : null,
        ];
    }
}
