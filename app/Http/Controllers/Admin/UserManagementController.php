<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $role = $request->string('role')->toString();
        $kaderStatus = $request->string('kader_status')->toString();
        $search = $request->string('search')->trim()->toString();

        $users = User::query()
            ->with('posyandu:id,name,code')
            ->when(
                $role !== '' && UserRole::tryFrom($role) !== null,
                fn ($query) => $query->where('role', $role)
            )
            ->when(
                $kaderStatus === 'pending',
                fn ($query) => $query->where('role', UserRole::Kader)->whereNull('kader_verified_at')
            )
            ->when(
                $kaderStatus === 'verified',
                fn ($query) => $query->where('role', UserRole::Kader)->whereNotNull('kader_verified_at')
            )
            ->when(
                $search !== '',
                fn ($query) => $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                })
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/KelolaPengguna', [
            'users' => $users,
            'posyandus' => Posyandu::query()->active()->orderBy('name')->get(['id', 'name', 'code']),
            'pendingKaderCount' => User::query()
                ->where('role', UserRole::Kader)
                ->whereNull('kader_verified_at')
                ->count(),
            'filters' => [
                'role' => $role,
                'kader_status' => $kaderStatus,
                'search' => $search,
            ],
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $role = UserRole::from($validated['role']);
        $verifyKader = $role === UserRole::Kader && (bool) ($validated['verify_kader'] ?? false);

        User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
            'role' => $role,
            'phone' => $validated['phone'] ?? null,
            'posyandu_id' => $role === UserRole::Admin ? null : ($validated['posyandu_id'] ?? null),
            'kader_verified_at' => $verifyKader ? now() : null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.users.index')
            ->with('status', 'Akun pengguna berhasil ditambahkan.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();
        $newRole = UserRole::from($validated['role']);
        $isActive = array_key_exists('is_active', $validated) ? (bool) $validated['is_active'] : $user->is_active;

        if ($request->user()->is($user) && ($newRole !== UserRole::Admin || ! $isActive)) {
            return back()->withErrors([
                'role' => 'Admin tidak dapat menurunkan peran atau menonaktifkan akunnya sendiri.',
            ]);
        }

        $attributes = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $newRole,
            'phone' => $validated['phone'] ?? null,
            'posyandu_id' => $newRole === UserRole::Admin ? null : ($validated['posyandu_id'] ?? null),
            'is_active' => $isActive,
        ];

        if ($newRole !== UserRole::Kader) {
            $attributes['kader_verified_at'] = null;
        }

        if (! empty($validated['password'])) {
            $attributes['password'] = Hash::make($validated['password']);
        }

        $user->update($attributes);

        return redirect()->route('admin.users.index')
            ->with('status', 'Data pengguna berhasil diperbarui.');
    }

    public function verifyKader(Request $request, User $user): RedirectResponse
    {
        if (! $user->isKader()) {
            return back()->withErrors([
                'user' => 'Hanya akun dengan peran kader yang dapat diverifikasi.',
            ]);
        }

        if ($user->posyandu_id === null) {
            return back()->withErrors([
                'posyandu_id' => 'Kader harus ditugaskan ke posyandu terlebih dahulu sebelum diverifikasi.',
            ]);
        }

        $user->update([
            'kader_verified_at' => now(),
            'is_active' => true,
        ]);

        return redirect()->route('admin.users.index')
            ->with('status', 'Akun kader berhasil diverifikasi.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            return back()->withErrors([
                'user' => 'Admin tidak dapat menghapus akunnya sendiri.',
            ]);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('status', 'Akun pengguna berhasil dihapus.');
    }
}
