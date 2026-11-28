<?php

use App\Models\Child;
use App\Models\ConsultationNote;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows parent to create, view saved, update, and delete consultation notes for their child', function () {
    $parent = User::factory()->orangTua()->create();
    $child = Child::factory()->create(['parent_id' => $parent->id]);

    $this->actingAs($parent)
        ->get(route('ortu.consultation-notes.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/CatatanKonsultasi')
            ->has('children', 1)
        );

    $this->actingAs($parent)
        ->post(route('ortu.consultation-notes.store'), [
            'child_id' => $child->id,
            'title' => 'Persiapan Posyandu Bulan Ini',
            'eating_pattern_notes' => 'Makan 3x sehari, agak pilih-pilih sayur.',
            'questions' => 'Apakah porsi protein hewani sudah cukup untuk usia anak?',
            'noted_at' => today()->toDateString(),
        ])
        ->assertRedirect(route('ortu.consultation-notes.saved'));

    $note = ConsultationNote::query()->where('child_id', $child->id)->firstOrFail();
    expect($note->user_id)->toBe($parent->id);

    $this->actingAs($parent)
        ->get(route('ortu.consultation-notes.saved'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('OrangTua/CatatanTersimpan')
            ->where('savedNote.id', $note->id)
        );

    $this->actingAs($parent)
        ->put(route('ortu.consultation-notes.update', $note), [
            'title' => 'Catatan Diperbarui',
            'questions' => 'Tanya jadwal vitamin A berikutnya.',
        ])
        ->assertRedirect(route('ortu.consultation-notes.create'));

    expect($note->fresh()->title)->toBe('Catatan Diperbarui');

    $this->actingAs($parent)
        ->delete(route('ortu.consultation-notes.destroy', $note))
        ->assertRedirect(route('ortu.consultation-notes.create'));

    $this->assertDatabaseMissing('consultation_notes', ['id' => $note->id]);
});

it('forbids parent from creating or modifying consultation notes for another parents child', function () {
    $parentA = User::factory()->orangTua()->create();
    $parentB = User::factory()->orangTua()->create();
    $childA = Child::factory()->create(['parent_id' => $parentA->id]);
    $noteA = ConsultationNote::factory()->create([
        'child_id' => $childA->id,
        'user_id' => $parentA->id,
    ]);

    $this->actingAs($parentB)
        ->post(route('ortu.consultation-notes.store'), [
            'child_id' => $childA->id,
            'questions' => 'Akses ilegal',
        ])
        ->assertForbidden();

    $this->actingAs($parentB)
        ->put(route('ortu.consultation-notes.update', $noteA), [
            'questions' => 'Diubah orang lain',
        ])
        ->assertForbidden();

    $this->actingAs($parentB)
        ->delete(route('ortu.consultation-notes.destroy', $noteA))
        ->assertForbidden();
});
