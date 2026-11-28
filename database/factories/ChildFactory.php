<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Models\Child;
use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Child>
 */
class ChildFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firstName = fake()->firstName();

        return [
            'parent_id' => User::factory()->orangTua(),
            'posyandu_id' => Posyandu::factory(),
            'name' => $firstName.' '.fake()->lastName(),
            'nickname' => $firstName,
            'nik' => fake()->numerify('3273############'),
            'birth_date' => fake()->dateTimeBetween('-4 years', '-2 months')->format('Y-m-d'),
            'gender' => fake()->randomElement(Gender::cases()),
            'birth_weight_kg' => fake()->randomFloat(2, 2.50, 4.10),
            'birth_height_cm' => fake()->randomFloat(1, 46.0, 53.0),
            'blood_type' => fake()->randomElement(['A', 'B', 'AB', 'O', null]),
            'notes' => null,
            'is_active' => true,
        ];
    }
}
