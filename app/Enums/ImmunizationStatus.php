<?php

namespace App\Enums;

enum ImmunizationStatus: string
{
    case Scheduled = 'scheduled';
    case Recorded = 'recorded';
    case Missed = 'missed';

    public function label(): string
    {
        return match ($this) {
            self::Scheduled => 'Belum Tercatat',
            self::Recorded => 'Sudah Tercatat',
            self::Missed => 'Terlewat',
        };
    }
}
