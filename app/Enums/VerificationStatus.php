<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case Unverified = 'unverified';
    case PendingNakes = 'pending_nakes';
    case VerifiedNakes = 'verified_nakes';

    public function label(): string
    {
        return match ($this) {
            self::Unverified => 'Belum Diverifikasi',
            self::PendingNakes => 'Menunggu Verifikasi Tenaga Kesehatan',
            self::VerifiedNakes => 'Terverifikasi Tenaga Kesehatan',
        };
    }
}
