<?php

namespace Database\Factories;

use App\Models\ChecklistTemplate;
use App\Models\Child;
use App\Models\ChildChecklistProgress;
use App\Models\PosyanduSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChildChecklistProgress>
 */
class ChildChecklistProgressFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'child_id' => Child::factory(),
            'posyandu_schedule_id' => PosyanduSchedule::factory(),
            'checklist_template_id' => ChecklistTemplate::factory(),
            'user_id' => User::factory()->orangTua(),
            'is_completed' => false,
            'completed_at' => null,
        ];
    }
}
