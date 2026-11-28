<?php

namespace App\Models;

use Database\Factories\EducationArticleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'education_category_id',
    'author_id',
    'title',
    'slug',
    'excerpt',
    'content',
    'thumbnail_url',
    'min_age_months',
    'max_age_months',
    'reading_time_minutes',
    'is_featured',
    'is_published',
    'published_at',
])]
class EducationArticle extends Model
{
    /** @use HasFactory<EducationArticleFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'min_age_months' => 'integer',
            'max_age_months' => 'integer',
            'reading_time_minutes' => 'integer',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EducationCategory::class, 'education_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    #[Scope]
    protected function published(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    #[Scope]
    protected function forAgeMonths(Builder $query, int $ageMonths): Builder
    {
        return $query
            ->where('min_age_months', '<=', $ageMonths)
            ->where('max_age_months', '>=', $ageMonths);
    }
}
