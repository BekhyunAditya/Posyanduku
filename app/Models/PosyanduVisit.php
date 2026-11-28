<?php

namespace App\Models;

use Database\Factories\PosyanduVisitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'child_id',
    'posyandu_schedule_id',
    'kader_id',
    'visited_at',
    'attendance_status',
    'services_provided',
    'service_notes',
    'needs_follow_up',
    'follow_up_notes',
    'follow_up_resolved_at',
])]
class PosyanduVisit extends Model
{
    /** @use HasFactory<PosyanduVisitFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'visited_at' => 'date',
            'services_provided' => 'array',
            'needs_follow_up' => 'boolean',
            'follow_up_resolved_at' => 'datetime',
        ];
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(PosyanduSchedule::class, 'posyandu_schedule_id');
    }

    public function kader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kader_id');
    }

    #[Scope]
    protected function openFollowUp(Builder $query): Builder
    {
        return $query->where('needs_follow_up', true)->whereNull('follow_up_resolved_at');
    }
}
