<?php

namespace App\Enums;

enum PosyanduActivityType: string
{
    case Weighing = 'penimbangan';
    case Checkup = 'pemeriksaan';
    case Counseling = 'penyuluhan';
    case Immunization = 'imunisasi';
    case Combined = 'terpadu';

    public function label(): string
    {
        return match ($this) {
            self::Weighing => 'Penimbangan',
            self::Checkup => 'Pemeriksaan',
            self::Counseling => 'Penyuluhan',
            self::Immunization => 'Imunisasi',
            self::Combined => 'Pelayanan Terpadu',
        };
    }
}
