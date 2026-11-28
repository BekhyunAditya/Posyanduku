<?php

namespace App\Models;

use Database\Factories\ChildChecklistProgressFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('child_checklist_progress')]
#[Fillable([
    'child_id',
    'posyandu_schedule_id',
    'checklist_template_id',
    'user_id',
    'is_completed',
    'completed_at',
])]
class ChildChecklistProgress extends Model
{
    /** @use HasFactory<ChildChecklistProgressFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
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

    public function template(): BelongsTo
    {
        return $this->belongsTo(ChecklistTemplate::class, 'checklist_template_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
