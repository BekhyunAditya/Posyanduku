<?php

namespace App\Models;

use App\Enums\ImmunizationStatus;
use App\Enums\VerificationStatus;
use Database\Factories\ChildImmunizationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'child_id',
    'immunization_schedule_id',
    'administered_at',
    'status',
    'verification_status',
    'recorded_by',
    'verified_by_name',
    'verified_at',
    'location',
    'notes',
])]
class ChildImmunization extends Model
{
    /** @use HasFactory<ChildImmunizationFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'administered_at' => 'date',
            'status' => ImmunizationStatus::class,
            'verification_status' => VerificationStatus::class,
            'verified_at' => 'datetime',
        ];
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(ImmunizationSchedule::class, 'immunization_schedule_id');
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
