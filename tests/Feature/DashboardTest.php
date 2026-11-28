<?php

use App\Enums\Gender;
use App\Models\ChecklistTemplate;
use App\Models\Child;
use App\Models\ChildChecklistProgress;
use App\Models\EducationArticle;
use App\Models\GrowthMeasurement;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use App\Models\User;
use Database\Seeders\ChecklistTemplateSeeder;
use Database\Seeders\ImmunizationScheduleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders parent dashboard with child profile, latest measurement, growth summary, next immunization, schedule, checklist, and shared props', function () {
    $this->seed([
        ImmunizationScheduleSeeder::class,
        ChecklistTemplateSeeder::class,
    ]);

    $posyandu = Posyandu::factory()->create();
    $parent = User::factory()->orangTua()->create(['posyandu_id' => $posyandu->id]);
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'parent_id' => $parent->id,
        'posyandu_id' => $posyandu->id,
        'gender' => Gender::Female,
        'birth_date' => now()->subMonths(12)->toDateString(),
    ]);

    GrowthMeasurement::factory()->create([
        'child_id' => $child->id,
        'kader_id' => $kader->id,
        'measured_at' => now()->subMonth()->toDateString(),
        'age_months' => 11,
        'weight_kg' => 8.80,
        'height_cm' => 73.0,
    ]);
    GrowthMeasurement::factory()->create([
        'child_id' => $child->id,
        'kader_id' => $kader->id,
        'measured_at' => today()->toDateString(),
        'age_months' => 12,
        'weight_kg' => 9.10,
        'height_cm' => 74.2,
        'weight_delta_kg' => 0.30,
        'height_delta_cm' => 1.2,
    ]);

    $schedule = PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyandu->id,
        'scheduled_date' => now()->addDays(4)->toDateString(),
        'is_published' => true,
    ]);

    $firstStep = ChecklistTemplate::query()->activeOrdered()->firstOrFail();
    ChildChecklistProgress::factory()->create([
        'child_id' => $child->id,
        'posyandu_schedule_id' => $schedule->id,
        'checklist_template_id' => $firstStep->id,
        'user_id' => $parent->id,
        'is_completed' => true,
        'completed_at' => now(),
    ]);

    PosyanduVisit::factory()->create([
        'child_id' => $child->id,
        'posyandu_schedule_id' => $schedule->id,
        'kader_id' => $kader->id,
        'needs_follow_up' => true,
        'follow_up_notes' => 'Bawa catatan makan bulan depan.',
        'follow_up_resolved_at' => null,
    ]);

    $this->actingAs($parent)
        ->get(route('ortu.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/DashboardOrtu')
            ->where('selectedChild.id', $child->id)
            ->where('selectedChild.age_months', 12)
            ->where('latestMeasurement.weight_kg', 9.1)
            ->where('growthSummary.comparison.weight_trend', 'meningkat')
            ->where('nextImmunization.code', 'HB-0')
            ->where('nextSchedule.id', $schedule->id)
            ->where('checklistProgress.label', '1/4 langkah selesai')
            ->has('openFollowUps', 1)
            ->has('navChildren', 1)
            ->where('unreadNotificationsCount', 0)
        );
});

it('renders kader dashboard scoped strictly to the kaders posyandu', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $kaderA = User::factory()->kader($posyanduA)->create();
    $childA = Child::factory()->create(['posyandu_id' => $posyanduA->id]);
    $childB = Child::factory()->create(['posyandu_id' => $posyanduB->id]);

    GrowthMeasurement::factory()->create([
        'child_id' => $childA->id,
        'kader_id' => $kaderA->id,
        'measured_at' => today()->toDateString(),
    ]);
    PosyanduVisit::factory()->create([
        'child_id' => $childA->id,
        'kader_id' => $kaderA->id,
        'visited_at' => today()->toDateString(),
        'attendance_status' => 'hadir',
        'needs_follow_up' => true,
        'follow_up_notes' => 'Perlu pemantauan ulang.',
        'follow_up_resolved_at' => null,
    ]);
    PosyanduVisit::factory()->create([
        'child_id' => $childB->id,
        'visited_at' => today()->toDateString(),
        'attendance_status' => 'hadir',
        'needs_follow_up' => true,
        'follow_up_notes' => 'Posyandu lain.',
        'follow_up_resolved_at' => null,
    ]);
    $scheduleA = PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'scheduled_date' => now()->addDays(5)->toDateString(),
    ]);
    PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyanduB->id,
        'scheduled_date' => now()->addDays(2)->toDateString(),
    ]);

    $this->actingAs($kaderA)
        ->get(route('kader.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Kader/DashboardKader')
            ->where('posyandu.id', $posyanduA->id)
            ->where('summary.total_children', 1)
            ->where('summary.measured_this_month', 1)
            ->where('summary.visits_this_month', 1)
            ->where('summary.open_follow_ups_count', 1)
            ->where('nextSchedule.id', $scheduleA->id)
            ->has('openFollowUps', 1)
            ->has('recentChildren', 1)
        );
});

it('renders admin dashboard with operational aggregates and pending kader queue', function () {
    $posyandu = Posyandu::factory()->create(['is_active' => true]);
    $admin = User::factory()->admin()->create();
    User::factory()->orangTua()->create(['posyandu_id' => $posyandu->id]);
    User::factory()->kader($posyandu)->create();
    $pendingKader = User::factory()->unverifiedKader($posyandu)->create();
    Child::factory()->create(['posyandu_id' => $posyandu->id]);
    EducationArticle::factory()->create(['is_published' => true]);
    EducationArticle::factory()->create(['is_published' => false]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/DashboardAdmin')
            ->where('summary.total_posyandus', 1)
            ->where('summary.active_posyandus', 1)
            ->where('summary.verified_kaders', 1)
            ->where('summary.pending_kaders', 1)
            ->where('summary.total_articles', 2)
            ->where('summary.published_articles', 1)
            ->where('summary.total_children_registered', 1)
            ->has('pendingKaders', 1)
            ->where('pendingKaders.0.id', $pendingKader->id)
        );
});
