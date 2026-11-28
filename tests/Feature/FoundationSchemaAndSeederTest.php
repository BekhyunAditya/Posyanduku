<?php

use App\Enums\Gender;
use App\Enums\UserRole;
use App\Enums\WhoIndicator;
use App\Models\ChecklistTemplate;
use App\Models\Child;
use App\Models\ChildChecklistProgress;
use App\Models\ChildImmunization;
use App\Models\ConsultationNote;
use App\Models\EducationArticle;
use App\Models\EducationCategory;
use App\Models\GrowthMeasurement;
use App\Models\ImmunizationSchedule;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\WhoGrowthStandard;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Schema;

it('creates all required domain tables from migrations', function () {
    $expectedTables = [
        'users',
        'posyandus',
        'children',
        'growth_measurements',
        'who_growth_standards',
        'immunization_schedules',
        'child_immunizations',
        'posyandu_schedules',
        'posyandu_visits',
        'checklist_templates',
        'child_checklist_progress',
        'consultation_notes',
        'education_categories',
        'education_articles',
        'notifications',
        'system_settings',
    ];

    foreach ($expectedTables as $table) {
        expect(Schema::hasTable($table))->toBeTrue("Tabel {$table} tidak ditemukan.");
    }
});

it('seeds master data idempotently across all foundation seeders', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    expect(Posyandu::query()->count())->toBe(2)
        ->and(User::query()->withRole(UserRole::Admin)->count())->toBe(1)
        ->and(User::query()->withRole(UserRole::Kader)->count())->toBe(2)
        ->and(User::query()->withRole(UserRole::OrangTua)->count())->toBe(1)
        ->and(ImmunizationSchedule::query()->count())->toBe(20)
        ->and(WhoGrowthStandard::query()->count())->toBe(72)
        ->and(WhoGrowthStandard::query()->forIndicatorAndGender(WhoIndicator::WeightForAge, Gender::Male)->count())->toBe(18)
        ->and(WhoGrowthStandard::query()->forIndicatorAndGender(WhoIndicator::HeightForAge, Gender::Female)->count())->toBe(18)
        ->and(EducationCategory::query()->count())->toBe(7)
        ->and(EducationArticle::query()->count())->toBe(7)
        ->and(ChecklistTemplate::query()->activeOrdered()->count())->toBe(4)
        ->and(SystemSetting::query()->count())->toBe(6);

    expect(SystemSetting::getValue('site_name'))->toBe('PosyanduKu')
        ->and(SystemSetting::getValue('notifications_in_app_enabled'))->toBeTrue();
});

it('persists domain models with factories and resolves core relationships', function () {
    $posyandu = Posyandu::factory()->create();
    $parent = User::factory()->orangTua()->create(['posyandu_id' => $posyandu->id]);
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'parent_id' => $parent->id,
        'posyandu_id' => $posyandu->id,
        'birth_date' => now()->subMonths(18)->toDateString(),
    ]);

    $measurement = GrowthMeasurement::factory()->create([
        'child_id' => $child->id,
        'kader_id' => $kader->id,
    ]);
    $immunization = ChildImmunization::factory()->create([
        'child_id' => $child->id,
        'recorded_by' => $kader->id,
    ]);
    $schedule = PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyandu->id,
        'created_by' => $kader->id,
    ]);
    $visit = PosyanduVisit::factory()->create([
        'child_id' => $child->id,
        'posyandu_schedule_id' => $schedule->id,
        'kader_id' => $kader->id,
    ]);
    $progress = ChildChecklistProgress::factory()->create([
        'child_id' => $child->id,
        'posyandu_schedule_id' => $schedule->id,
        'user_id' => $parent->id,
        'is_completed' => true,
        'completed_at' => now(),
    ]);
    $note = ConsultationNote::factory()->create([
        'child_id' => $child->id,
        'user_id' => $parent->id,
        'posyandu_schedule_id' => $schedule->id,
    ]);
    $article = EducationArticle::factory()->create();

    expect($child->parent->is($parent))->toBeTrue()
        ->and($child->posyandu->is($posyandu))->toBeTrue()
        ->and($child->latestMeasurement->is($measurement))->toBeTrue()
        ->and($child->immunizations->first()->is($immunization))->toBeTrue()
        ->and($child->visits->first()->is($visit))->toBeTrue()
        ->and($child->checklistProgress->first()->is($progress))->toBeTrue()
        ->and($child->consultationNotes->first()->is($note))->toBeTrue()
        ->and($child->ageInMonths())->toBe(18)
        ->and($child->ageLabel())->toBe('1 tahun 6 bulan')
        ->and($article->category)->not->toBeNull();
});
