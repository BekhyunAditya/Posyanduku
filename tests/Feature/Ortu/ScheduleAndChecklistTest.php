<?php

use App\Models\ChecklistTemplate;
use App\Models\Child;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use App\Models\User;
use Database\Seeders\ChecklistTemplateSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('shows only published schedules of the childs posyandu and open follow-ups for the owning parent', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $parentA = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $parentB = User::factory()->orangTua()->create(['posyandu_id' => $posyanduB->id]);

    $childA = Child::factory()->create(['parent_id' => $parentA->id, 'posyandu_id' => $posyanduA->id]);
    $childB = Child::factory()->create(['parent_id' => $parentB->id, 'posyandu_id' => $posyanduB->id]);

    $publishedA = PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'scheduled_date' => now()->addDays(5)->toDateString(),
        'is_published' => true,
    ]);
    PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'scheduled_date' => now()->addDays(6)->toDateString(),
        'is_published' => false,
    ]);
    PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyanduB->id,
        'scheduled_date' => now()->addDays(4)->toDateString(),
        'is_published' => true,
    ]);

    $followUpA = PosyanduVisit::factory()->create([
        'child_id' => $childA->id,
        'needs_follow_up' => true,
        'follow_up_notes' => 'Konsultasi gizi dengan bidan.',
        'follow_up_resolved_at' => null,
    ]);
    PosyanduVisit::factory()->create([
        'child_id' => $childB->id,
        'needs_follow_up' => true,
        'follow_up_notes' => 'Rahasia anak lain.',
        'follow_up_resolved_at' => null,
    ]);

    $this->actingAs($parentA)
        ->get(route('ortu.schedules.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/KalenderPosyandu')
            ->has('upcomingSchedules', 1)
            ->where('nextSchedule.id', $publishedA->id)
            ->has('openFollowUps', 1)
            ->where('openFollowUps.0.id', $followUpA->id)
        );
});

it('tracks interactive posyandu readiness checklist progress from 0/4 to 4/4 and enforces ownership', function () {
    $this->seed(ChecklistTemplateSeeder::class);

    $posyandu = Posyandu::factory()->create();
    $parentA = User::factory()->orangTua()->create(['posyandu_id' => $posyandu->id]);
    $parentB = User::factory()->orangTua()->create(['posyandu_id' => $posyandu->id]);

    $childA = Child::factory()->create(['parent_id' => $parentA->id, 'posyandu_id' => $posyandu->id]);
    $schedule = PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyandu->id,
        'scheduled_date' => now()->addDays(3)->toDateString(),
        'is_published' => true,
    ]);

    $templates = ChecklistTemplate::query()->activeOrdered()->get();
    expect($templates)->toHaveCount(4);

    // Initially 0/4 completed
    $this->actingAs($parentA)
        ->get(route('ortu.visit-guide.index', ['child_id' => $childA->id, 'schedule_id' => $schedule->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/PanduanKunjungan')
            ->where('progress.completed', 0)
            ->where('progress.total', 4)
            ->where('progress.label', '0/4 langkah selesai')
            ->has('groupedGuide.sebelum', 2)
            ->has('groupedGuide.saat', 1)
            ->has('groupedGuide.sesudah', 1)
        );

    // Complete all 4 steps
    foreach ($templates as $template) {
        $this->actingAs($parentA)
            ->post(route('ortu.checklist.toggle'), [
                'child_id' => $childA->id,
                'posyandu_schedule_id' => $schedule->id,
                'checklist_template_id' => $template->id,
                'is_completed' => true,
            ])
            ->assertRedirect();
    }

    // Now 4/4 completed
    $this->actingAs($parentA)
        ->get(route('ortu.visit-guide.index', ['child_id' => $childA->id, 'schedule_id' => $schedule->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('progress.completed', 4)
            ->where('progress.total', 4)
            ->where('progress.label', '4/4 langkah selesai')
            ->where('progress.percentage', 100)
        );

    // Parent B cannot toggle checklist for Parent A's child
    $this->actingAs($parentB)
        ->post(route('ortu.checklist.toggle'), [
            'child_id' => $childA->id,
            'posyandu_schedule_id' => $schedule->id,
            'checklist_template_id' => $templates[0]->id,
            'is_completed' => false,
        ])
        ->assertForbidden();
});
