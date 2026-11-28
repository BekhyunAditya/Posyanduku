<?php

namespace App\Policies;

use App\Models\Child;
use App\Models\ConsultationNote;
use App\Models\User;

class ConsultationNotePolicy
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
        return $user->isOrangTua();
    }

    public function view(User $user, ConsultationNote $note): bool
    {
        return $user->isOrangTua()
            && $note->user_id === $user->id
            && $note->child?->parent_id === $user->id;
    }

    public function create(User $user, ?Child $child = null): bool
    {
        if (! $user->isOrangTua()) {
            return false;
        }

        if ($child !== null) {
            return $child->parent_id === $user->id;
        }

        return true;
    }

    public function update(User $user, ConsultationNote $note): bool
    {
        return $user->isOrangTua()
            && $note->user_id === $user->id
            && $note->child?->parent_id === $user->id;
    }

    public function delete(User $user, ConsultationNote $note): bool
    {
        return $user->isOrangTua()
            && $note->user_id === $user->id
            && $note->child?->parent_id === $user->id;
    }
}
