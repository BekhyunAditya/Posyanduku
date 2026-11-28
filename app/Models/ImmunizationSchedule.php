<?php

namespace App\Models;

use Database\Factories\ImmunizationScheduleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'code',
    'name',
    'target_age_months',
    'age_label',
    'dose_number',
    'is_mandatory',
    'description',
    'sort_order',
])]
class ImmunizationSchedule extends Model
{
    /** @use HasFactory<ImmunizationScheduleFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'target_age_months' => 'integer',
            'dose_number' => 'integer',
            'is_mandatory' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function childImmunizations(): HasMany
    {
        return $this->hasMany(ChildImmunization::class);
    }

    #[Scope]
    protected function ordered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('target_age_months');
    }
}
