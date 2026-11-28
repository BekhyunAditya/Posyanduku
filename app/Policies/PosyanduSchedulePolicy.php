<?php

namespace App\Policies;

use App\Models\PosyanduSchedule;
use App\Models\User;

class PosyanduSchedulePolicy
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
        return $user->isOrangTua() || $user->isVerifiedKader() || $user->isAdmin();
    }

    public function view(User $user, PosyanduSchedule $schedule): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isVerifiedKader()) {
            return $user->posyandu_id !== null && $schedule->posyandu_id === $user->posyandu_id;
        }

        if ($user->isOrangTua()) {
            if (! $schedule->is_published) {
                return false;
            }

            return $user->posyandu_id === $schedule->posyandu_id
                || $user->children()->where('posyandu_id', $schedule->posyandu_id)->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isVerifiedKader() && $user->posyandu_id !== null;
    }

    public function update(User $user, PosyanduSchedule $schedule): bool
    {
        return $user->isVerifiedKader()
            && $user->posyandu_id !== null
            && $schedule->posyandu_id === $user->posyandu_id;
    }

    public function delete(User $user, PosyanduSchedule $schedule): bool
    {
        return $user->isVerifiedKader()
            && $user->posyandu_id !== null
            && $schedule->posyandu_id === $user->posyandu_id;
    }
}
