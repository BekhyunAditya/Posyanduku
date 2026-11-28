<?php

namespace App\Policies;

use App\Models\Child;
use App\Models\ChildImmunization;
use App\Models\User;

class ChildImmunizationPolicy
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

    public function view(User $user, ChildImmunization $immunization): bool
    {
        $child = $immunization->child;

        if ($child === null) {
            return false;
        }

        if ($user->isOrangTua()) {
            return $child->parent_id === $user->id;
        }

        if ($user->isVerifiedKader()) {
            return $user->posyandu_id !== null && $child->posyandu_id === $user->posyandu_id;
        }

        return false;
    }

    public function create(User $user, ?Child $child = null): bool
    {
        if (! $user->isVerifiedKader() || $user->posyandu_id === null) {
            return false;
        }

        if ($child !== null) {
            return $child->posyandu_id === $user->posyandu_id;
        }

        return true;
    }

    public function update(User $user, ChildImmunization $immunization): bool
    {
        $child = $immunization->child;

        return $user->isVerifiedKader()
            && $user->posyandu_id !== null
            && $child !== null
            && $child->posyandu_id === $user->posyandu_id;
    }

    public function delete(User $user, ChildImmunization $immunization): bool
    {
        $child = $immunization->child;

        return $user->isVerifiedKader()
            && $user->posyandu_id !== null
            && $child !== null
            && $child->posyandu_id === $user->posyandu_id;
    }
}
