<?php

namespace App\Policies;

use App\Models\Child;
use App\Models\User;

class ChildPolicy
{
    public function before(User $user): ?bool
    {
        if (! $user->is_active) {
            return false;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->isOrangTua() || $user->isVerifiedKader();
    }

    public function view(User $user, Child $child): bool
    {
        if ($user->isOrangTua()) {
            return $child->parent_id === $user->id;
        }

        if ($user->isVerifiedKader()) {
            return $user->posyandu_id !== null && $child->posyandu_id === $user->posyandu_id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isOrangTua();
    }

    public function update(User $user, Child $child): bool
    {
        return $user->isOrangTua() && $child->parent_id === $user->id;
    }

    public function delete(User $user, Child $child): bool
    {
        return $user->isOrangTua() && $child->parent_id === $user->id;
    }
}
