<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\WhoIndicator;
use Database\Factories\WhoGrowthStandardFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'indicator',
    'gender',
    'age_months',
    'length_cm',
    'sd_minus_3',
    'sd_minus_2',
    'sd_minus_1',
    'median',
    'sd_plus_1',
    'sd_plus_2',
    'sd_plus_3',
])]
class WhoGrowthStandard extends Model
{
    /** @use HasFactory<WhoGrowthStandardFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'indicator' => WhoIndicator::class,
            'gender' => Gender::class,
            'age_months' => 'integer',
            'length_cm' => 'decimal:1',
            'sd_minus_3' => 'decimal:2',
            'sd_minus_2' => 'decimal:2',
            'sd_minus_1' => 'decimal:2',
            'median' => 'decimal:2',
            'sd_plus_1' => 'decimal:2',
            'sd_plus_2' => 'decimal:2',
            'sd_plus_3' => 'decimal:2',
        ];
    }

    #[Scope]
    protected function forIndicatorAndGender(Builder $query, WhoIndicator $indicator, Gender $gender): Builder
    {
        return $query
            ->where('indicator', $indicator)
            ->where('gender', $gender)
            ->orderBy('age_months')
            ->orderBy('length_cm');
    }
}
