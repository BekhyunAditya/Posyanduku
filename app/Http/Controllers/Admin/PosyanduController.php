<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePosyanduRequest;
use App\Http\Requests\Admin\UpdatePosyanduRequest;
use App\Models\Posyandu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PosyanduController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->toString();

        $posyandus = Posyandu::query()
            ->withCount(['children', 'users', 'schedules'])
            ->when(
                $search !== '',
                fn ($query) => $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('village', 'like', "%{$search}%")
                        ->orWhere('district', 'like', "%{$search}%");
                })
            )
            ->when(
                $status === 'active',
                fn ($query) => $query->where('is_active', true)
            )
            ->when(
                $status === 'inactive',
                fn ($query) => $query->where('is_active', false)
            )
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/KelolaPosyandu', [
            'posyandus' => $posyandus,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function store(StorePosyanduRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Posyandu::query()->create([
            ...$validated,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.posyandus.index')
            ->with('status', 'Data posyandu berhasil ditambahkan.');
    }

    public function update(UpdatePosyanduRequest $request, Posyandu $posyandu): RedirectResponse
    {
        $posyandu->update($request->validated());

        return redirect()->route('admin.posyandus.index')
            ->with('status', 'Data posyandu berhasil diperbarui.');
    }

    public function destroy(Posyandu $posyandu): RedirectResponse
    {
        $posyandu->delete();

        return redirect()->route('admin.posyandus.index')
            ->with('status', 'Data posyandu berhasil dihapus.');
    }
}
