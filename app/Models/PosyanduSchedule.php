<?php

namespace App\Models;

use App\Enums\PosyanduActivityType;
use Database\Factories\PosyanduScheduleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'posyandu_id',
    'created_by',
    'title',
    'activity_type',
    'scheduled_date',
    'start_time',
    'end_time',
    'location',
    'required_items',
    'description',
    'is_published',
])]
class PosyanduSchedule extends Model
{
    /** @use HasFactory<PosyanduScheduleFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'activity_type' => PosyanduActivityType::class,
            'scheduled_date' => 'date',
            'required_items' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function posyandu(): BelongsTo
    {
        return $this->belongsTo(Posyandu::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function visits(): HasMany
    {
        return $this->hasMany(PosyanduVisit::class);
    }

    public function checklistProgress(): HasMany
    {
        return $this->hasMany(ChildChecklistProgress::class);
    }

    #[Scope]
    protected function published(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    #[Scope]
    protected function upcoming(Builder $query): Builder
    {
        return $query->whereDate('scheduled_date', '>=', today())->orderBy('scheduled_date');
    }
}
