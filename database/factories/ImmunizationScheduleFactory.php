<?php

namespace Database\Factories;

use App\Models\ImmunizationSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ImmunizationSchedule>
 */
class ImmunizationScheduleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ageMonths = fake()->randomElement([0, 1, 2, 3, 4, 9, 12, 18]);

        return [
            'code' => strtoupper(fake()->unique()->lexify('VAC-????')),
            'name' => 'Imunisasi '.fake()->word(),
            'target_age_months' => $ageMonths,
            'age_label' => "{$ageMonths} bulan",
            'dose_number' => 1,
            'is_mandatory' => true,
            'description' => fake()->sentence(),
            'sort_order' => $ageMonths,
        ];
    }
}
