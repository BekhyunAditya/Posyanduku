<?php

use App\Enums\PosyanduActivityType;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows verified kader to create, list, update, and delete posyandu schedules for their own posyandu', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();
    $kaderA = User::factory()->kader($posyanduA)->create();

    PosyanduSchedule::factory()->create(['posyandu_id' => $posyanduB->id, 'title' => 'Jadwal Posyandu Lain']);

    $this->actingAs($kaderA)
        ->post(route('kader.schedules.store'), [
            'title' => 'Penimbangan & Penyuluhan Bulanan',
            'activity_type' => PosyanduActivityType::Combined->value,
            'scheduled_date' => now()->addDays(10)->toDateString(),
            'start_time' => '08:00',
            'end_time' => '11:00',
            'location' => 'Balai RW 03',
            'required_items' => ['Buku KIA', 'Pakaian ringan'],
            'description' => 'Harap hadir tepat waktu.',
            'is_published' => true,
        ])
        ->assertRedirect(route('kader.schedules.index'));

    $schedule = PosyanduSchedule::query()->where('title', 'Penimbangan & Penyuluhan Bulanan')->firstOrFail();
    expect($schedule->posyandu_id)->toBe($posyanduA->id)
        ->and($schedule->created_by)->toBe($kaderA->id)
        ->and($schedule->required_items)->toBe(['Buku KIA', 'Pakaian ringan']);

    // Index lists only Posyandu A schedules
    $this->actingAs($kaderA)
        ->get(route('kader.schedules.index', ['scope' => 'upcoming']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Kader/KelolaJadwal')
            ->has('schedules.data', 1)
            ->where('schedules.data.0.id', $schedule->id)
        );

    // Update schedule
    $this->actingAs($kaderA)
        ->put(route('kader.schedules.update', $schedule), [
            'title' => 'Penimbangan & Imunisasi Bulanan',
            'activity_type' => PosyanduActivityType::Immunization->value,
            'scheduled_date' => now()->addDays(12)->toDateString(),
            'start_time' => '08:30',
            'end_time' => '11:30',
            'location' => 'Aula RW 03',
            'required_items' => ['Buku KIA'],
            'is_published' => false,
        ])
        ->assertRedirect(route('kader.schedules.index'));

    expect($schedule->fresh()->title)->toBe('Penimbangan & Imunisasi Bulanan')
        ->and($schedule->fresh()->is_published)->toBeFalse();

    // Delete schedule
    $this->actingAs($kaderA)
        ->delete(route('kader.schedules.destroy', $schedule))
        ->assertRedirect(route('kader.schedules.index'));

    $this->assertDatabaseMissing('posyandu_schedules', ['id' => $schedule->id]);
});

it('validates schedule times and forbids cross-posyandu or unverified kader management', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $kaderA = User::factory()->kader($posyanduA)->create();
    $kaderB = User::factory()->kader($posyanduB)->create();
    $unverifiedKaderA = User::factory()->unverifiedKader($posyanduA)->create();
    $scheduleA = PosyanduSchedule::factory()->create(['posyandu_id' => $posyanduA->id]);

    // End time before start time
    $this->actingAs($kaderA)
        ->post(route('kader.schedules.store'), [
            'title' => 'Jadwal Waktu Salah',
            'activity_type' => PosyanduActivityType::Weighing->value,
            'scheduled_date' => now()->addDays(5)->toDateString(),
            'start_time' => '11:00',
            'end_time' => '08:00',
            'location' => 'Balai RW',
        ])
        ->assertSessionHasErrors('end_time');

    $validPayload = [
        'title' => 'Ubah Paksa',
        'activity_type' => PosyanduActivityType::Weighing->value,
        'scheduled_date' => now()->addDays(5)->toDateString(),
        'start_time' => '08:00',
        'end_time' => '10:00',
        'location' => 'Balai RW',
    ];

    $this->actingAs($kaderB)->put(route('kader.schedules.update', $scheduleA), $validPayload)->assertForbidden();
    $this->actingAs($kaderB)->delete(route('kader.schedules.destroy', $scheduleA))->assertForbidden();
    $this->actingAs($unverifiedKaderA)->post(route('kader.schedules.store'), $validPayload)->assertForbidden();
});
