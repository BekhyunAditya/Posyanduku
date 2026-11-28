<?php

use App\Models\Child;
use App\Models\ChildImmunization;
use App\Models\ConsultationNote;
use App\Models\GrowthMeasurement;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\PosyanduVisit;
use App\Models\User;

it('restricts child access to owning parent and verified kader of the same posyandu', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $parentA = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $parentB = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $kaderA = User::factory()->kader($posyanduA)->create();
    $kaderB = User::factory()->kader($posyanduB)->create();
    $unverifiedKaderA = User::factory()->unverifiedKader($posyanduA)->create();
    $admin = User::factory()->admin()->create();

    $childA = Child::factory()->create([
        'parent_id' => $parentA->id,
        'posyandu_id' => $posyanduA->id,
    ]);

    // Owning parent has full CRUD on own child
    expect($parentA->can('viewAny', Child::class))->toBeTrue()
        ->and($parentA->can('create', Child::class))->toBeTrue()
        ->and($parentA->can('view', $childA))->toBeTrue()
        ->and($parentA->can('update', $childA))->toBeTrue()
        ->and($parentA->can('delete', $childA))->toBeTrue();

    // Another parent is blocked (IDOR protection)
    expect($parentB->can('view', $childA))->toBeFalse()
        ->and($parentB->can('update', $childA))->toBeFalse()
        ->and($parentB->can('delete', $childA))->toBeFalse();

    // Verified kader of same posyandu can view, but cannot create/modify/delete parent child profile
    expect($kaderA->can('viewAny', Child::class))->toBeTrue()
        ->and($kaderA->can('view', $childA))->toBeTrue()
        ->and($kaderA->can('create', Child::class))->toBeFalse()
        ->and($kaderA->can('update', $childA))->toBeFalse()
        ->and($kaderA->can('delete', $childA))->toBeFalse();

    // Kader of different posyandu and unverified kader are blocked
    expect($kaderB->can('view', $childA))->toBeFalse()
        ->and($unverifiedKaderA->can('viewAny', Child::class))->toBeFalse()
        ->and($unverifiedKaderA->can('view', $childA))->toBeFalse();

    // Admin has no automatic clinical access to child records
    expect($admin->can('viewAny', Child::class))->toBeFalse()
        ->and($admin->can('view', $childA))->toBeFalse()
        ->and($admin->can('create', Child::class))->toBeFalse()
        ->and($admin->can('update', $childA))->toBeFalse()
        ->and($admin->can('delete', $childA))->toBeFalse();
});

it('restricts growth measurements, immunizations, and visits to verified posyandu kader for writes and owning parent for reads', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $parentA = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $parentB = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $kaderA = User::factory()->kader($posyanduA)->create();
    $kaderB = User::factory()->kader($posyanduB)->create();
    $unverifiedKaderA = User::factory()->unverifiedKader($posyanduA)->create();
    $admin = User::factory()->admin()->create();

    $childA = Child::factory()->create([
        'parent_id' => $parentA->id,
        'posyandu_id' => $posyanduA->id,
    ]);

    $measurement = GrowthMeasurement::factory()->create(['child_id' => $childA->id, 'kader_id' => $kaderA->id]);
    $immunization = ChildImmunization::factory()->create(['child_id' => $childA->id, 'recorded_by' => $kaderA->id]);
    $visit = PosyanduVisit::factory()->create(['child_id' => $childA->id, 'kader_id' => $kaderA->id]);

    foreach ([
        [GrowthMeasurement::class, $measurement],
        [ChildImmunization::class, $immunization],
        [PosyanduVisit::class, $visit],
    ] as [$modelClass, $record]) {
        // Owning parent: read only
        expect($parentA->can('view', $record))->toBeTrue()
            ->and($parentA->can('create', [$modelClass, $childA]))->toBeFalse()
            ->and($parentA->can('update', $record))->toBeFalse()
            ->and($parentA->can('delete', $record))->toBeFalse();

        // Other parent: denied
        expect($parentB->can('view', $record))->toBeFalse();

        // Verified kader of same posyandu: full clinical management
        expect($kaderA->can('view', $record))->toBeTrue()
            ->and($kaderA->can('create', [$modelClass, $childA]))->toBeTrue()
            ->and($kaderA->can('update', $record))->toBeTrue()
            ->and($kaderA->can('delete', $record))->toBeTrue();

        // Kader of another posyandu: denied
        expect($kaderB->can('view', $record))->toBeFalse()
            ->and($kaderB->can('create', [$modelClass, $childA]))->toBeFalse()
            ->and($kaderB->can('update', $record))->toBeFalse()
            ->and($kaderB->can('delete', $record))->toBeFalse();

        // Unverified kader: denied
        expect($unverifiedKaderA->can('view', $record))->toBeFalse()
            ->and($unverifiedKaderA->can('create', [$modelClass, $childA]))->toBeFalse()
            ->and($unverifiedKaderA->can('update', $record))->toBeFalse()
            ->and($unverifiedKaderA->can('delete', $record))->toBeFalse();

        // Admin: no clinical authority
        expect($admin->can('viewAny', $modelClass))->toBeFalse()
            ->and($admin->can('view', $record))->toBeFalse()
            ->and($admin->can('create', [$modelClass, $childA]))->toBeFalse()
            ->and($admin->can('update', $record))->toBeFalse()
            ->and($admin->can('delete', $record))->toBeFalse();
    }
});

it('scopes posyandu schedule management to verified kader and visibility to relevant parents and admin', function () {
    $posyanduA = Posyandu::factory()->create();
    $posyanduB = Posyandu::factory()->create();

    $parentA = User::factory()->orangTua()->create(['posyandu_id' => $posyanduA->id]);
    $parentB = User::factory()->orangTua()->create(['posyandu_id' => $posyanduB->id]);
    $kaderA = User::factory()->kader($posyanduA)->create();
    $kaderB = User::factory()->kader($posyanduB)->create();
    $unverifiedKaderA = User::factory()->unverifiedKader($posyanduA)->create();
    $admin = User::factory()->admin()->create();

    $publishedScheduleA = PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'created_by' => $kaderA->id,
        'is_published' => true,
    ]);
    $draftScheduleA = PosyanduSchedule::factory()->create([
        'posyandu_id' => $posyanduA->id,
        'created_by' => $kaderA->id,
        'is_published' => false,
    ]);

    // Parent A can view published schedule in their posyandu, not draft or create/edit
    expect($parentA->can('view', $publishedScheduleA))->toBeTrue()
        ->and($parentA->can('view', $draftScheduleA))->toBeFalse()
        ->and($parentA->can('create', PosyanduSchedule::class))->toBeFalse()
        ->and($parentA->can('update', $publishedScheduleA))->toBeFalse()
        ->and($parentA->can('delete', $publishedScheduleA))->toBeFalse();

    // Parent B in different posyandu cannot view Posyandu A's schedule
    expect($parentB->can('view', $publishedScheduleA))->toBeFalse();

    // Verified Kader A manages Posyandu A schedules (including drafts)
    expect($kaderA->can('create', PosyanduSchedule::class))->toBeTrue()
        ->and($kaderA->can('view', $draftScheduleA))->toBeTrue()
        ->and($kaderA->can('update', $publishedScheduleA))->toBeTrue()
        ->and($kaderA->can('delete', $publishedScheduleA))->toBeTrue();

    // Kader B and unverified kader cannot manage Posyandu A schedules
    expect($kaderB->can('view', $publishedScheduleA))->toBeFalse()
        ->and($kaderB->can('update', $publishedScheduleA))->toBeFalse()
        ->and($unverifiedKaderA->can('create', PosyanduSchedule::class))->toBeFalse()
        ->and($unverifiedKaderA->can('view', $publishedScheduleA))->toBeFalse();

    // Admin has operational view access to schedules, not kader write access
    expect($admin->can('viewAny', PosyanduSchedule::class))->toBeTrue()
        ->and($admin->can('view', $publishedScheduleA))->toBeTrue()
        ->and($admin->can('create', PosyanduSchedule::class))->toBeFalse()
        ->and($admin->can('update', $publishedScheduleA))->toBeFalse();
});

it('restricts consultation notes strictly to the owning parent', function () {
    $parentA = User::factory()->orangTua()->create();
    $parentB = User::factory()->orangTua()->create();
    $kader = User::factory()->kader()->create();
    $admin = User::factory()->admin()->create();

    $childA = Child::factory()->create(['parent_id' => $parentA->id]);
    $noteA = ConsultationNote::factory()->create([
        'child_id' => $childA->id,
        'user_id' => $parentA->id,
    ]);

    expect($parentA->can('create', [ConsultationNote::class, $childA]))->toBeTrue()
        ->and($parentA->can('view', $noteA))->toBeTrue()
        ->and($parentA->can('update', $noteA))->toBeTrue()
        ->and($parentA->can('delete', $noteA))->toBeTrue()
        ->and($parentB->can('create', [ConsultationNote::class, $childA]))->toBeFalse()
        ->and($parentB->can('view', $noteA))->toBeFalse()
        ->and($kader->can('view', $noteA))->toBeFalse()
        ->and($admin->can('view', $noteA))->toBeFalse();
});

it('denies all policy actions for inactive users', function () {
    $posyandu = Posyandu::factory()->create();
    $inactiveParent = User::factory()->orangTua()->inactive()->create(['posyandu_id' => $posyandu->id]);
    $inactiveKader = User::factory()->kader($posyandu)->inactive()->create();
    $child = Child::factory()->create([
        'parent_id' => $inactiveParent->id,
        'posyandu_id' => $posyandu->id,
    ]);
    $schedule = PosyanduSchedule::factory()->create(['posyandu_id' => $posyandu->id]);

    expect($inactiveParent->can('view', $child))->toBeFalse()
        ->and($inactiveParent->can('update', $child))->toBeFalse()
        ->and($inactiveParent->can('view', $schedule))->toBeFalse()
        ->and($inactiveKader->can('view', $child))->toBeFalse()
        ->and($inactiveKader->can('create', [GrowthMeasurement::class, $child]))->toBeFalse()
        ->and($inactiveKader->can('create', PosyanduSchedule::class))->toBeFalse();
});
