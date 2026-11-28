<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PosyanduSeeder::class,
            UserSeeder::class,
            ImmunizationScheduleSeeder::class,
            WhoGrowthStandardSeeder::class,
            EducationSeeder::class,
            ChecklistTemplateSeeder::class,
            SystemSettingSeeder::class,
        ]);
    }
}
