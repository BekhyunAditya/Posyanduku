<?php

namespace App\Services;

use App\Enums\WhoIndicator;
use App\Models\Child;
use App\Models\GrowthMeasurement;
use App\Models\SystemSetting;
use App\Models\WhoGrowthStandard;
use Illuminate\Support\Collection;

class GrowthChartService
{
    public const DEFAULT_DISCLAIMER = 'Grafik pertumbuhan dan ringkasan di PosyanduKu berfungsi sebagai alat pemantauan awal berdasarkan kurva referensi WHO, bukan alat diagnosis medis otomatis. Konsultasikan hasil pengukuran dengan kader atau tenaga kesehatan berwenang.';

    /**
     * Recalculate chronological age_months and deltas for every measurement of a child.
     */
    public function recalculateSeries(Child $child): void
    {
        /** @var Collection<int, GrowthMeasurement> $measurements */
        $measurements = $child->growthMeasurements()
            ->reorder()
            ->orderBy('measured_at')
            ->orderBy('id')
            ->get();

        $previous = null;

        foreach ($measurements as $measurement) {
            $ageMonths = $child->ageInMonths($measurement->measured_at);
            $weightDelta = $previous !== null
                ? round((float) $measurement->weight_kg - (float) $previous->weight_kg, 2)
                : null;
            $heightDelta = $previous !== null
                ? round((float) $measurement->height_cm - (float) $previous->height_cm, 2)
                : null;

            $measurement->forceFill([
                'age_months' => $ageMonths,
                'weight_delta_kg' => $weightDelta,
                'height_delta_cm' => $heightDelta,
            ])->save();

            $previous = $measurement;
        }
    }

    /**
     * Build complete growth monitoring payload: child points, WHO reference curves, and comparison summary.
     *
     * @return array<string, mixed>
     */
    public function buildChartPayload(Child $child): array
    {
        $measurements = $child->growthMeasurements()
            ->with('kader:id,name')
            ->reorder()
            ->orderBy('measured_at')
            ->orderBy('id')
            ->get();

        $points = $measurements->map(fn (GrowthMeasurement $measurement): array => [
            'id' => $measurement->id,
            'measured_at' => $measurement->measured_at->toDateString(),
            'age_months' => $measurement->age_months,
            'weight_kg' => (float) $measurement->weight_kg,
            'height_cm' => (float) $measurement->height_cm,
            'head_circumference_cm' => $measurement->head_circumference_cm !== null
                ? (float) $measurement->head_circumference_cm
                : null,
            'weight_delta_kg' => $measurement->weight_delta_kg !== null
                ? (float) $measurement->weight_delta_kg
                : null,
            'height_delta_cm' => $measurement->height_delta_cm !== null
                ? (float) $measurement->height_delta_cm
                : null,
            'notes' => $measurement->notes,
            'recorder' => $measurement->kader?->name,
        ])->values()->all();

        $weightCurves = WhoGrowthStandard::query()
            ->forIndicatorAndGender(WhoIndicator::WeightForAge, $child->gender)
            ->get()
            ->map(fn (WhoGrowthStandard $row): array => $this->formatWhoPoint($row))
            ->values()
            ->all();

        $heightCurves = WhoGrowthStandard::query()
            ->forIndicatorAndGender(WhoIndicator::HeightForAge, $child->gender)
            ->get()
            ->map(fn (WhoGrowthStandard $row): array => $this->formatWhoPoint($row))
            ->values()
            ->all();

        $latest = $measurements->last();
        $previous = $measurements->count() >= 2 ? $measurements->get($measurements->count() - 2) : null;

        return [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'nickname' => $child->nickname,
                'gender' => $child->gender->value,
                'gender_label' => $child->gender->label(),
                'age_months' => $child->ageInMonths(),
                'age_label' => $child->ageLabel(),
            ],
            'points' => $points,
            'history' => array_reverse($points),
            'who_curves' => [
                'weight_for_age' => $weightCurves,
                'height_for_age' => $heightCurves,
            ],
            'comparison' => $this->buildComparison($latest, $previous),
            'disclaimer' => (string) SystemSetting::getValue('medical_disclaimer', self::DEFAULT_DISCLAIMER),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildComparison(?GrowthMeasurement $latest, ?GrowthMeasurement $previous): array
    {
        if ($latest === null) {
            return [
                'latest' => null,
                'previous' => null,
                'weight_delta_kg' => null,
                'height_delta_cm' => null,
                'weight_trend' => 'belum_ada_data',
                'height_trend' => 'belum_ada_data',
                'needs_attention_note' => false,
                'summary_message' => 'Belum ada catatan pengukuran untuk anak ini.',
            ];
        }

        if ($previous === null) {
            return [
                'latest' => [
                    'measured_at' => $latest->measured_at->toDateString(),
                    'weight_kg' => (float) $latest->weight_kg,
                    'height_cm' => (float) $latest->height_cm,
                    'age_months' => $latest->age_months,
                ],
                'previous' => null,
                'weight_delta_kg' => null,
                'height_delta_cm' => null,
                'weight_trend' => 'pengukuran_pertama',
                'height_trend' => 'pengukuran_pertama',
                'needs_attention_note' => false,
                'summary_message' => 'Pengukuran pertama telah tercatat. Lanjutkan penimbangan rutin bulan berikutnya untuk melihat tren pertumbuhan.',
            ];
        }

        $weightDelta = round((float) $latest->weight_kg - (float) $previous->weight_kg, 2);
        $heightDelta = round((float) $latest->height_cm - (float) $previous->height_cm, 2);

        $weightTrend = match (true) {
            $weightDelta > 0 => 'meningkat',
            $weightDelta < 0 => 'menurun',
            default => 'tetap',
        };

        $heightTrend = match (true) {
            $heightDelta > 0 => 'meningkat',
            $heightDelta < 0 => 'menurun',
            default => 'tetap',
        };

        $needsAttentionNote = $weightDelta <= 0;

        $summaryMessage = $needsAttentionNote
            ? 'Berat badan belum meningkat dibandingkan pengukuran sebelumnya. Catat pola makan anak dan diskusikan bersama kader atau tenaga kesehatan.'
            : sprintf(
                'Berat badan meningkat +%.2f kg dan tinggi/panjang badan berubah %+.1f cm dibandingkan pengukuran sebelumnya.',
                $weightDelta,
                $heightDelta
            );

        return [
            'latest' => [
                'measured_at' => $latest->measured_at->toDateString(),
                'weight_kg' => (float) $latest->weight_kg,
                'height_cm' => (float) $latest->height_cm,
                'age_months' => $latest->age_months,
            ],
            'previous' => [
                'measured_at' => $previous->measured_at->toDateString(),
                'weight_kg' => (float) $previous->weight_kg,
                'height_cm' => (float) $previous->height_cm,
                'age_months' => $previous->age_months,
            ],
            'weight_delta_kg' => $weightDelta,
            'height_delta_cm' => $heightDelta,
            'weight_trend' => $weightTrend,
            'height_trend' => $heightTrend,
            'needs_attention_note' => $needsAttentionNote,
            'summary_message' => $summaryMessage,
        ];
    }

    /**
     * @return array<string, float|int|null>
     */
    private function formatWhoPoint(WhoGrowthStandard $row): array
    {
        return [
            'age_months' => $row->age_months,
            'sd_minus_3' => (float) $row->sd_minus_3,
            'sd_minus_2' => (float) $row->sd_minus_2,
            'sd_minus_1' => (float) $row->sd_minus_1,
            'median' => (float) $row->median,
            'sd_plus_1' => (float) $row->sd_plus_1,
            'sd_plus_2' => (float) $row->sd_plus_2,
            'sd_plus_3' => (float) $row->sd_plus_3,
        ];
    }
}
