<?php

namespace App\Models;

use Database\Factories\ConsultationNoteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'child_id',
    'user_id',
    'posyandu_schedule_id',
    'title',
    'eating_pattern_notes',
    'questions',
    'follow_up_plan',
    'noted_at',
])]
class ConsultationNote extends Model
{
    /** @use HasFactory<ConsultationNoteFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'noted_at' => 'date',
        ];
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(PosyanduSchedule::class, 'posyandu_schedule_id');
    }
}
