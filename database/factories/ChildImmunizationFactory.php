<?php

namespace Database\Factories;

use App\Enums\ImmunizationStatus;
use App\Enums\VerificationStatus;
use App\Models\Child;
use App\Models\ChildImmunization;
use App\Models\ImmunizationSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChildImmunization>
 */
class ChildImmunizationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'child_id' => Child::factory(),
            'immunization_schedule_id' => ImmunizationSchedule::factory(),
            'administered_at' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'status' => ImmunizationStatus::Recorded,
            'verification_status' => VerificationStatus::PendingNakes,
            'recorded_by' => User::factory()->kader(),
            'verified_by_name' => null,
            'verified_at' => null,
            'location' => 'Posyandu Melati',
            'notes' => null,
        ];
    }
}
