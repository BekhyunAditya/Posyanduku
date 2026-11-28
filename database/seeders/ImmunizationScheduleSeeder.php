<?php

namespace Database\Seeders;

use App\Models\ImmunizationSchedule;
use Illuminate\Database\Seeder;

class ImmunizationScheduleSeeder extends Seeder
{
    /**
     * Master jadwal imunisasi rutin balita mengacu pedoman Kementerian Kesehatan RI.
     */
    public function run(): void
    {
        $schedules = [
            ['code' => 'HB-0', 'name' => 'Hepatitis B (HB-0)', 'target_age_months' => 0, 'age_label' => '0 bulan (Baru Lahir, < 24 jam)', 'dose_number' => 1, 'description' => 'Diberikan segera setelah lahir untuk melindungi bayi dari infeksi Hepatitis B.', 'sort_order' => 1],
            ['code' => 'BCG', 'name' => 'BCG', 'target_age_months' => 1, 'age_label' => '1 bulan', 'dose_number' => 1, 'description' => 'Melindungi anak dari tuberkulosis berat.', 'sort_order' => 2],
            ['code' => 'OPV-1', 'name' => 'Polio Tetes 1 (OPV 1)', 'target_age_months' => 1, 'age_label' => '1 bulan', 'dose_number' => 1, 'description' => 'Dosis pertama imunisasi polio oral.', 'sort_order' => 3],
            ['code' => 'DPT-HB-HIB-1', 'name' => 'DPT-HB-Hib 1', 'target_age_months' => 2, 'age_label' => '2 bulan', 'dose_number' => 1, 'description' => 'Melindungi dari difteri, pertusis, tetanus, Hepatitis B, dan infeksi Hib.', 'sort_order' => 4],
            ['code' => 'OPV-2', 'name' => 'Polio Tetes 2 (OPV 2)', 'target_age_months' => 2, 'age_label' => '2 bulan', 'dose_number' => 2, 'description' => 'Dosis kedua imunisasi polio oral.', 'sort_order' => 5],
            ['code' => 'PCV-1', 'name' => 'PCV 1', 'target_age_months' => 2, 'age_label' => '2 bulan', 'dose_number' => 1, 'description' => 'Melindungi dari infeksi pneumokokus penyebab pneumonia.', 'sort_order' => 6],
            ['code' => 'RV-1', 'name' => 'Rotavirus 1 (RV 1)', 'target_age_months' => 2, 'age_label' => '2 bulan', 'dose_number' => 1, 'description' => 'Melindungi bayi dari diare berat akibat rotavirus.', 'sort_order' => 7],
            ['code' => 'DPT-HB-HIB-2', 'name' => 'DPT-HB-Hib 2', 'target_age_months' => 3, 'age_label' => '3 bulan', 'dose_number' => 2, 'description' => 'Dosis kedua DPT-HB-Hib.', 'sort_order' => 8],
            ['code' => 'OPV-3', 'name' => 'Polio Tetes 3 (OPV 3)', 'target_age_months' => 3, 'age_label' => '3 bulan', 'dose_number' => 3, 'description' => 'Dosis ketiga imunisasi polio oral.', 'sort_order' => 9],
            ['code' => 'PCV-2', 'name' => 'PCV 2', 'target_age_months' => 3, 'age_label' => '3 bulan', 'dose_number' => 2, 'description' => 'Dosis kedua imunisasi PCV.', 'sort_order' => 10],
            ['code' => 'RV-2', 'name' => 'Rotavirus 2 (RV 2)', 'target_age_months' => 3, 'age_label' => '3 bulan', 'dose_number' => 2, 'description' => 'Dosis kedua imunisasi Rotavirus.', 'sort_order' => 11],
            ['code' => 'DPT-HB-HIB-3', 'name' => 'DPT-HB-Hib 3', 'target_age_months' => 4, 'age_label' => '4 bulan', 'dose_number' => 3, 'description' => 'Dosis ketiga DPT-HB-Hib.', 'sort_order' => 12],
            ['code' => 'OPV-4', 'name' => 'Polio Tetes 4 (OPV 4)', 'target_age_months' => 4, 'age_label' => '4 bulan', 'dose_number' => 4, 'description' => 'Dosis keempat imunisasi polio oral.', 'sort_order' => 13],
            ['code' => 'IPV-1', 'name' => 'Polio Suntik 1 (IPV 1)', 'target_age_months' => 4, 'age_label' => '4 bulan', 'dose_number' => 1, 'description' => 'Imunisasi polio suntik dosis pertama.', 'sort_order' => 14],
            ['code' => 'RV-3', 'name' => 'Rotavirus 3 (RV 3)', 'target_age_months' => 4, 'age_label' => '4 bulan', 'dose_number' => 3, 'description' => 'Dosis ketiga imunisasi Rotavirus.', 'sort_order' => 15],
            ['code' => 'MR-1', 'name' => 'Campak-Rubela 1 (MR 1)', 'target_age_months' => 9, 'age_label' => '9 bulan', 'dose_number' => 1, 'description' => 'Melindungi anak dari penyakit campak dan rubela.', 'sort_order' => 16],
            ['code' => 'IPV-2', 'name' => 'Polio Suntik 2 (IPV 2)', 'target_age_months' => 9, 'age_label' => '9 bulan', 'dose_number' => 2, 'description' => 'Imunisasi polio suntik dosis kedua sesuai pedoman nasional.', 'sort_order' => 17],
            ['code' => 'PCV-3', 'name' => 'PCV 3 (Lanjutan)', 'target_age_months' => 12, 'age_label' => '12 bulan', 'dose_number' => 3, 'description' => 'Dosis lanjutan imunisasi PCV.', 'sort_order' => 18],
            ['code' => 'DPT-HB-HIB-4', 'name' => 'DPT-HB-Hib Lanjutan', 'target_age_months' => 18, 'age_label' => '18 bulan', 'dose_number' => 4, 'description' => 'Imunisasi lanjutan baduta untuk mempertahankan kekebalan.', 'sort_order' => 19],
            ['code' => 'MR-2', 'name' => 'Campak-Rubela 2 (MR 2)', 'target_age_months' => 18, 'age_label' => '18 bulan', 'dose_number' => 2, 'description' => 'Dosis lanjutan Campak-Rubela pada usia baduta.', 'sort_order' => 20],
        ];

        foreach ($schedules as $schedule) {
            ImmunizationSchedule::query()->updateOrCreate(
                ['code' => $schedule['code']],
                [
                    ...$schedule,
                    'is_mandatory' => true,
                ]
            );
        }
    }
}
