<?php

namespace Database\Factories;

use App\Models\EducationArticle;
use App\Models\EducationCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<EducationArticle>
 */
class EducationArticleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(6);

        return [
            'education_category_id' => EducationCategory::factory(),
            'author_id' => User::factory()->admin(),
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(2),
            'content' => fake()->paragraphs(4, true),
            'thumbnail_url' => null,
            'min_age_months' => 0,
            'max_age_months' => 60,
            'reading_time_minutes' => fake()->numberBetween(2, 6),
            'is_featured' => false,
            'is_published' => true,
            'published_at' => now(),
        ];
    }
}
