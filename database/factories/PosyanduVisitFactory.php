<?php

namespace Database\Factories;

use App\Models\Child;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PosyanduVisit>
 */
class PosyanduVisitFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'child_id' => Child::factory(),
            'posyandu_schedule_id' => PosyanduSchedule::factory(),
            'kader_id' => User::factory()->kader(),
            'visited_at' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'attendance_status' => 'hadir',
            'services_provided' => ['penimbangan', 'pengukuran_tinggi', 'penyuluhan'],
            'service_notes' => fake()->sentence(),
            'needs_follow_up' => false,
            'follow_up_notes' => null,
            'follow_up_resolved_at' => null,
        ];
    }
}
