<?php

namespace Database\Seeders;

use App\Enums\Gender;
use App\Enums\PosyanduActivityType;
use App\Enums\UserRole;
use App\Models\Child;
use App\Models\GrowthMeasurement;
use App\Models\Posyandu;
use App\Models\PosyanduSchedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $melati = Posyandu::query()->where('code', 'POS-MLT-01')->first();

        User::query()->updateOrCreate(
            ['email' => 'admin@posyanduku.test'],
            [
                'name' => 'Admin PosyanduKu',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::Admin,
                'phone' => '081200000001',
                'posyandu_id' => null,
                'kader_verified_at' => null,
                'is_active' => true,
            ]
        );

        $kader = User::query()->updateOrCreate(
            ['email' => 'kader@posyanduku.test'],
            [
                'name' => 'Siti Rahmawati',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::Kader,
                'phone' => '081200000002',
                'posyandu_id' => $melati?->id,
                'kader_verified_at' => now(),
                'is_active' => true,
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'kader.pending@posyanduku.test'],
            [
                'name' => 'Dewi Lestari (Menunggu Verifikasi)',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::Kader,
                'phone' => '081200000003',
                'posyandu_id' => $melati?->id,
                'kader_verified_at' => null,
                'is_active' => true,
            ]
        );

        $parent = User::query()->updateOrCreate(
            ['email' => 'ortu@posyanduku.test'],
            [
                'name' => 'Rina Kartika',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::OrangTua,
                'phone' => '081200000004',
                'posyandu_id' => $melati?->id,
                'kader_verified_at' => null,
                'is_active' => true,
            ]
        );

        $child = Child::query()->updateOrCreate(
            [
                'parent_id' => $parent->id,
                'name' => 'Nadia Azzahra',
            ],
            [
                'posyandu_id' => $melati?->id,
                'nickname' => 'Nadia',
                'birth_date' => now()->subMonths(14)->toDateString(),
                'gender' => Gender::Female,
                'birth_weight_kg' => 3.15,
                'birth_height_cm' => 49.0,
                'blood_type' => 'O',
                'notes' => 'Anak aktif, mengikuti jadwal penimbangan bulanan.',
                'is_active' => true,
            ]
        );

        $sampleMeasurements = [
            ['months_ago' => 2, 'age_months' => 12, 'weight_kg' => 8.90, 'height_cm' => 74.0, 'weight_delta_kg' => 0.30, 'height_delta_cm' => 1.2],
            ['months_ago' => 1, 'age_months' => 13, 'weight_kg' => 9.15, 'height_cm' => 75.1, 'weight_delta_kg' => 0.25, 'height_delta_cm' => 1.1],
            ['months_ago' => 0, 'age_months' => 14, 'weight_kg' => 9.35, 'height_cm' => 76.0, 'weight_delta_kg' => 0.20, 'height_delta_cm' => 0.9],
        ];

        foreach ($sampleMeasurements as $item) {
            GrowthMeasurement::query()->updateOrCreate(
                [
                    'child_id' => $child->id,
                    'age_months' => $item['age_months'],
                ],
                [
                    'kader_id' => $kader->id,
                    'measured_at' => now()->subMonths($item['months_ago'])->toDateString(),
                    'weight_kg' => $item['weight_kg'],
                    'height_cm' => $item['height_cm'],
                    'weight_delta_kg' => $item['weight_delta_kg'],
                    'height_delta_cm' => $item['height_delta_cm'],
                    'notes' => 'Pengukuran rutin posyandu.',
                ]
            );
        }

        if ($melati !== null) {
            PosyanduSchedule::query()->updateOrCreate(
                [
                    'posyandu_id' => $melati->id,
                    'title' => 'Posyandu Balita Bulanan - Penimbangan & Penyuluhan Gizi',
                ],
                [
                    'created_by' => $kader->id,
                    'activity_type' => PosyanduActivityType::Combined,
                    'scheduled_date' => now()->addDays(7)->toDateString(),
                    'start_time' => '08:00:00',
                    'end_time' => '11:00:00',
                    'location' => 'Balai Warga RW 03, Jl. Melati Indah No. 12',
                    'required_items' => [
                        'Buku KIA fisik',
                        'Kartu identitas anak / fotokopi KK',
                        'Pakaian ringan untuk penimbangan',
                        'Catatan pertanyaan untuk kader atau bidan',
                    ],
                    'description' => 'Kegiatan penimbangan rutin, pengukuran panjang/tinggi badan, pencatatan imunisasi, dan edukasi MPASI bergizi.',
                    'is_published' => true,
                ]
            );
        }
    }
}
