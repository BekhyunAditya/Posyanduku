<?php

namespace App\Enums;

enum UserRole: string
{
    case OrangTua = 'orang_tua';
    case Kader = 'kader';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::OrangTua => 'Orang Tua',
            self::Kader => 'Kader Posyandu',
            self::Admin => 'Admin',
        };
    }

    public function dashboardRoute(): string
    {
        return match ($this) {
            self::OrangTua => 'ortu.dashboard',
            self::Kader => 'kader.dashboard',
            self::Admin => 'admin.dashboard',
        };
    }
}
