<?php

namespace App\Enums;

enum WhoIndicator: string
{
    case WeightForAge = 'bb_u';
    case HeightForAge = 'tb_u';
    case WeightForHeight = 'bb_tb';

    public function label(): string
    {
        return match ($this) {
            self::WeightForAge => 'Berat Badan menurut Umur (BB/U)',
            self::HeightForAge => 'Tinggi Badan menurut Umur (TB/U)',
            self::WeightForHeight => 'Berat Badan menurut Tinggi Badan (BB/TB)',
        };
    }
}
