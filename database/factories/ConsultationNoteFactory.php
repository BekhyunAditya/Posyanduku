<?php

namespace Database\Factories;

use App\Models\Child;
use App\Models\ConsultationNote;
use App\Models\PosyanduSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConsultationNote>
 */
class ConsultationNoteFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'child_id' => Child::factory(),
            'user_id' => User::factory()->orangTua(),
            'posyandu_schedule_id' => PosyanduSchedule::factory(),
            'title' => 'Catatan Persiapan Konsultasi',
            'eating_pattern_notes' => fake()->sentence(),
            'questions' => fake()->sentence(),
            'follow_up_plan' => null,
            'noted_at' => today()->format('Y-m-d'),
        ];
    }
}
