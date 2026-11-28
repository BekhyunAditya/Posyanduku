<?php

namespace App\Models;

use Database\Factories\GrowthMeasurementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'child_id',
    'kader_id',
    'measured_at',
    'age_months',
    'weight_kg',
    'height_cm',
    'head_circumference_cm',
    'weight_delta_kg',
    'height_delta_cm',
    'notes',
])]
class GrowthMeasurement extends Model
{
    /** @use HasFactory<GrowthMeasurementFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'measured_at' => 'date',
            'age_months' => 'integer',
            'weight_kg' => 'decimal:2',
            'height_cm' => 'decimal:2',
            'head_circumference_cm' => 'decimal:2',
            'weight_delta_kg' => 'decimal:2',
            'height_delta_cm' => 'decimal:2',
        ];
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function kader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kader_id');
    }
}
