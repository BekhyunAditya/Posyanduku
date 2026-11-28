<?php

use App\Models\Child;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows verified kader to record visits, services, and follow-ups, then resolve and delete them', function () {
    $posyandu = Posyandu::factory()->create();
    $kader = User::factory()->kader($posyandu)->create();
    $child = Child::factory()->create([
        'posyandu_id' => $posyandu->id,
        'birth_date' => now()->subMonths(14)->toDateString(),
    ]);
    $schedule = PosyanduSchedule::factory()->create(['posyandu_id' => $posyandu->id]);

    $this->actingAs($kader)
        ->post(route('kader.visits.store', $child), [
            'posyandu_schedule_id' => $schedule->id,
            'visited_at' => today()->toDateString(),
            'attendance_status' => 'hadir',
            'services_provided' => ['penimbangan', 'pengukuran_tinggi', 'pmt', 'penyuluhan'],
            'service_notes' => 'Anak kooperatif saat penimbangan.',
            'needs_follow_up' => true,
            'follow_up_notes' => 'Anjurkan konsultasi pola makan ke bidan puskesmas pekan depan.',
        ])
        ->assertRedirect(route('kader.children.show', $child));

    $visit = PosyanduVisit::query()->where('child_id', $child->id)->firstOrFail();
    expect($visit->needs_follow_up)->toBeTrue()
        ->and($visit->follow_up_resolved_at)->toBeNull();

    // Visits index & follow-ups index
    $this->actingAs($kader)
        ->get(route('kader.visits.index', ['posyandu_schedule_id' => $schedule->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('visits.data', 1)
            ->where('visits.data.0.id', $visit->id)
        );

    $this->actingAs($kader)
        ->get(route('kader.follow-ups.index', ['status' => 'open']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.open_count', 1)
            ->where('summary.resolved_count', 0)
            ->has('followUps.data', 1)
        );

    // Resolve follow-up
    $this->actingAs($kader)
        ->put(route('kader.visits.update', [$child, $visit]), [
            'posyandu_schedule_id' => $schedule->id,
            'visited_at' => today()->toDateString(),
            'attendance_status' => 'hadir',
            'services_provided' => ['penimbangan', 'pmt'],
            'needs_follow_up' => true,
            'follow_up_notes' => 'Sudah dikonsultasikan ke bidan.',
            'resolve_follow_up' => true,
        ])
        ->assertRedirect(route('kader.children.show', $child));

    expect($visit->fresh()->follow_up_resolved_at)->not->toBeNull();

    // Delete visit
    $this->actingAs($kader)
        ->delete(route('kader.visits.destroy', [$child, $visit]))
        ->assertRedirect(route('kader.children.show', $child));

    $this->assertDatabaseMissing('posyandu_visits', ['id' => $visit->id]);
});

it('requires follow_up_notes when needs_follow_up is true and forbids cross-posyandu visit recording', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $kaderA = User::factory()->kader($posyanduA)->create();
    $kaderB = User::factory()->kader($posyanduB)->create();
    $childA = Child::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'birth_date' => now()->subMonths(12)->toDateString(),
    ]);
    $otherChildA = Child::factory()->create(['posyandu_id' => $posyanduA->id]);
    $visitA = PosyanduVisit::factory()->create(['child_id' => $childA->id, 'kader_id' => $kaderA->id]);

    $this->actingAs($kaderA)
        ->post(route('kader.visits.store', $childA), [
            'visited_at' => today()->toDateString(),
            'attendance_status' => 'hadir',
            'needs_follow_up' => true,
        ])
        ->assertSessionHasErrors('follow_up_notes');

    $this->actingAs($kaderB)
        ->post(route('kader.visits.store', $childA), [
            'visited_at' => today()->toDateString(),
            'attendance_status' => 'hadir',
        ])
        ->assertForbidden();

    // Scoped binding prevents deleting visit under another child's URL
    $this->actingAs($kaderA)
        ->delete(route('kader.visits.destroy', [$otherChildA, $visitA]))
        ->assertNotFound();
});
