<?php

namespace Database\Factories;

use App\Enums\PosyanduActivityType;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PosyanduSchedule>
 */
class PosyanduScheduleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'posyandu_id' => Posyandu::factory(),
            'created_by' => User::factory()->kader(),
            'title' => 'Posyandu Balita Bulanan',
            'activity_type' => fake()->randomElement(PosyanduActivityType::cases()),
            'scheduled_date' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d'),
            'start_time' => '08:00:00',
            'end_time' => '11:00:00',
            'location' => 'Balai RW 03',
            'required_items' => ['Buku KIA', 'Kartu Keluarga / KIA', 'Pakaian nyaman untuk ditimbang'],
            'description' => fake()->sentence(),
            'is_published' => true,
        ];
    }
}
