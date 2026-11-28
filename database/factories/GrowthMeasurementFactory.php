<?php

namespace Database\Factories;

use App\Models\Child;
use App\Models\GrowthMeasurement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GrowthMeasurement>
 */
class GrowthMeasurementFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'child_id' => Child::factory(),
            'kader_id' => User::factory()->kader(),
            'measured_at' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'age_months' => fake()->numberBetween(1, 48),
            'weight_kg' => fake()->randomFloat(2, 4.50, 16.50),
            'height_cm' => fake()->randomFloat(1, 55.0, 105.0),
            'head_circumference_cm' => fake()->randomFloat(1, 36.0, 50.0),
            'weight_delta_kg' => fake()->randomFloat(2, -0.20, 0.80),
            'height_delta_cm' => fake()->randomFloat(1, 0.0, 2.5),
            'notes' => null,
        ];
    }
}
