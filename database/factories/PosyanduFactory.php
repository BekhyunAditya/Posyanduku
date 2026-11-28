<?php

namespace Database\Factories;

use App\Models\Posyandu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Posyandu>
 */
class PosyanduFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Posyandu '.fake()->unique()->randomElement(['Melati', 'Mawar', 'Kenanga', 'Dahlia', 'Anggrek', 'Flamboyan']).' '.fake()->numberBetween(1, 9),
            'code' => 'POS-'.fake()->unique()->numerify('###'),
            'address' => fake()->streetAddress(),
            'rt' => str_pad((string) fake()->numberBetween(1, 12), 2, '0', STR_PAD_LEFT),
            'rw' => str_pad((string) fake()->numberBetween(1, 8), 2, '0', STR_PAD_LEFT),
            'village' => fake()->citySuffix().' '.fake()->lastName(),
            'district' => fake()->city(),
            'city' => 'Bandung',
            'phone' => fake()->numerify('08##########'),
            'routine_schedule' => 'Rabu minggu ke-2, 08.00 - 11.00 WIB',
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
