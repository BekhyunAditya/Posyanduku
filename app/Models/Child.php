<?php

namespace App\Models;

use App\Enums\Gender;
use Carbon\CarbonInterface;
use Database\Factories\ChildFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'parent_id',
    'posyandu_id',
    'name',
    'nickname',
    'nik',
    'birth_date',
    'gender',
    'birth_weight_kg',
    'birth_height_cm',
    'blood_type',
    'notes',
    'is_active',
])]
class Child extends Model
{
    /** @use HasFactory<ChildFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'gender' => Gender::class,
            'birth_weight_kg' => 'decimal:2',
            'birth_height_cm' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function posyandu(): BelongsTo
    {
        return $this->belongsTo(Posyandu::class);
    }

    public function growthMeasurements(): HasMany
    {
        return $this->hasMany(GrowthMeasurement::class)->orderBy('measured_at');
    }

    public function latestMeasurement(): HasOne
    {
        return $this->hasOne(GrowthMeasurement::class)->latestOfMany('measured_at');
    }

    public function immunizations(): HasMany
    {
        return $this->hasMany(ChildImmunization::class);
    }

    public function visits(): HasMany
    {
        return $this->hasMany(PosyanduVisit::class)->orderByDesc('visited_at');
    }

    public function checklistProgress(): HasMany
    {
        return $this->hasMany(ChildChecklistProgress::class);
    }

    public function consultationNotes(): HasMany
    {
        return $this->hasMany(ConsultationNote::class)->latest();
    }

    #[Scope]
    protected function active(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function ageInMonths(?CarbonInterface $asOf = null): int
    {
        $reference = $asOf ?? now();

        return (int) max(0, $this->birth_date->diffInMonths($reference));
    }

    public function ageLabel(?CarbonInterface $asOf = null): string
    {
        $totalMonths = $this->ageInMonths($asOf);
        $years = intdiv($totalMonths, 12);
        $months = $totalMonths % 12;

        if ($years === 0) {
            return "{$months} bulan";
        }

        if ($months === 0) {
            return "{$years} tahun";
        }

        return "{$years} tahun {$months} bulan";
    }
}
