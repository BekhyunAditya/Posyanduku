<?php

namespace App\Http\Middleware;

use App\Models\Child;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'status' => fn (): ?string => $request->session()->get('status'),
            ],
            'unreadNotificationsCount' => fn (): int => $user !== null
                ? $user->unreadNotifications()->count()
                : 0,
            'navChildren' => fn (): array => ($user !== null && $user->isOrangTua())
                ? $user->children()
                    ->active()
                    ->orderBy('name')
                    ->get(['id', 'name', 'nickname', 'birth_date'])
                    ->map(fn (Child $child): array => [
                        'id' => $child->id,
                        'name' => $child->name,
                        'nickname' => $child->nickname,
                        'age_label' => $child->ageLabel(),
                    ])
                    ->all()
                : [],
        ];
    }
}
