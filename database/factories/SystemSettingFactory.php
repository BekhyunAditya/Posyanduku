<?php

namespace Database\Factories;

use App\Models\SystemSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SystemSetting>
 */
class SystemSettingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(2, '_'),
            'value' => fake()->word(),
            'type' => 'string',
            'group' => 'general',
            'label' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'updated_by' => null,
        ];
    }
}
