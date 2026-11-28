<?php

namespace App\Services;

use App\Enums\ImmunizationStatus;
use App\Enums\VerificationStatus;
use App\Models\Child;
use App\Models\ChildImmunization;
use App\Models\ImmunizationSchedule;

class ImmunizationTrackerService
{
    public const KEMENKES_NOTE = 'Jadwal imunisasi mengacu pada pedoman Kementerian Kesehatan RI. Pencatatan yang memerlukan validasi medis harus diverifikasi oleh tenaga kesehatan berwenang.';

    /**
     * Build complete immunization schedule, status, verification details, and next reminder for a child.
     *
     * @return array<string, mixed>
     */
    public function buildSummaryForChild(Child $child): array
    {
        $ageMonths = $child->ageInMonths();
        $masterSchedules = ImmunizationSchedule::query()->ordered()->get();
        $recordsBySchedule = $child->immunizations()
            ->with('recorder:id,name')
            ->get()
            ->keyBy('immunization_schedule_id');

        $items = $masterSchedules->map(function (ImmunizationSchedule $schedule) use ($child, $ageMonths, $recordsBySchedule): array {
            /** @var ChildImmunization|null $record */
            $record = $recordsBySchedule->get($schedule->id);
            $effectiveStatus = $this->resolveEffectiveStatus($schedule, $record, $ageMonths);
            $verificationStatus = $record?->verification_status ?? VerificationStatus::Unverified;

            return [
                'schedule_id' => $schedule->id,
                'record_id' => $record?->id,
                'code' => $schedule->code,
                'name' => $schedule->name,
                'target_age_months' => $schedule->target_age_months,
                'age_label' => $schedule->age_label,
                'dose_number' => $schedule->dose_number,
                'is_mandatory' => $schedule->is_mandatory,
                'description' => $schedule->description,
                'estimated_due_date' => $child->birth_date->copy()->addMonths($schedule->target_age_months)->toDateString(),
                'status' => $effectiveStatus,
                'status_label' => $this->statusLabel($effectiveStatus),
                'administered_at' => $record?->administered_at?->toDateString(),
                'verification_status' => $verificationStatus->value,
                'verification_label' => $verificationStatus->label(),
                'verified_by_name' => $record?->verified_by_name,
                'verified_at' => $record?->verified_at?->toIso8601String(),
                'location' => $record?->location,
                'notes' => $record?->notes,
                'recorded_by' => $record?->recorder?->name,
            ];
        })->values();

        $nextImmunization = $items->first(fn (array $item): bool => $item['status'] !== 'recorded');

        $recordedCount = $items->where('status', 'recorded')->count();
        $verifiedCount = $items
            ->where('status', 'recorded')
            ->where('verification_status', VerificationStatus::VerifiedNakes->value)
            ->count();
        $pendingVerificationCount = $items
            ->where('status', 'recorded')
            ->where('verification_status', VerificationStatus::PendingNakes->value)
            ->count();

        return [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'age_months' => $ageMonths,
                'age_label' => $child->ageLabel(),
            ],
            'schedules' => $items->all(),
            'history' => $items->where('record_id', '!=', null)->values()->all(),
            'next_immunization' => $nextImmunization,
            'summary' => [
                'total_schedules' => $items->count(),
                'recorded_count' => $recordedCount,
                'verified_count' => $verifiedCount,
                'pending_verification_count' => $pendingVerificationCount,
                'remaining_count' => max(0, $items->count() - $recordedCount),
            ],
            'reference_note' => self::KEMENKES_NOTE,
        ];
    }

    private function resolveEffectiveStatus(
        ImmunizationSchedule $schedule,
        ?ChildImmunization $record,
        int $ageMonths
    ): string {
        if ($record?->status === ImmunizationStatus::Recorded) {
            return 'recorded';
        }

        if ($record?->status === ImmunizationStatus::Missed) {
            return 'missed';
        }

        if ($ageMonths > $schedule->target_age_months) {
            return 'overdue';
        }

        if ($ageMonths === $schedule->target_age_months) {
            return 'due';
        }

        return 'upcoming';
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'recorded' => 'Sudah Tercatat',
            'missed' => 'Terlewat',
            'overdue' => 'Perlu Konfirmasi Petugas',
            'due' => 'Jadwal Usia Saat Ini',
            default => 'Belum Tercatat',
        };
    }
}
