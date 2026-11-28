<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Enums\WhoIndicator;
use App\Models\WhoGrowthStandard;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WhoGrowthStandard>
 */
class WhoGrowthStandardFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $median = fake()->randomFloat(2, 6.0, 15.0);

        return [
            'indicator' => WhoIndicator::WeightForAge,
            'gender' => fake()->randomElement(Gender::cases()),
            'age_months' => fake()->unique()->numberBetween(0, 60),
            'length_cm' => null,
            'sd_minus_3' => round($median - 3.0, 2),
            'sd_minus_2' => round($median - 2.0, 2),
            'sd_minus_1' => round($median - 1.0, 2),
            'median' => $median,
            'sd_plus_1' => round($median + 1.0, 2),
            'sd_plus_2' => round($median + 2.0, 2),
            'sd_plus_3' => round($median + 3.0, 2),
        ];
    }
}
