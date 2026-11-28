<?php

namespace Database\Seeders;

use App\Models\Posyandu;
use Illuminate\Database\Seeder;

class PosyanduSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posyandus = [
            [
                'code' => 'POS-MLT-01',
                'name' => 'Posyandu Melati 01',
                'address' => 'Jl. Melati Indah No. 12, Balai Warga RW 03',
                'rt' => '02',
                'rw' => '03',
                'village' => 'Sukamaju',
                'district' => 'Cibeunying',
                'city' => 'Bandung',
                'phone' => '081234567801',
                'routine_schedule' => 'Rabu minggu ke-2, 08.00 - 11.00 WIB',
                'description' => 'Posyandu balita binaan RW 03 dengan layanan penimbangan, pengukuran tinggi badan, imunisasi, dan penyuluhan gizi.',
                'is_active' => true,
            ],
            [
                'code' => 'POS-MWR-02',
                'name' => 'Posyandu Mawar 02',
                'address' => 'Jl. Mawar Raya No. 8, Aula RW 05',
                'rt' => '04',
                'rw' => '05',
                'village' => 'Sukamaju',
                'district' => 'Cibeunying',
                'city' => 'Bandung',
                'phone' => '081234567802',
                'routine_schedule' => 'Kamis minggu ke-3, 08.00 - 11.00 WIB',
                'description' => 'Posyandu balita binaan RW 05 untuk pemantauan rutin tumbuh kembang dan pendampingan orang tua.',
                'is_active' => true,
            ],
        ];

        foreach ($posyandus as $data) {
            Posyandu::query()->updateOrCreate(
                ['code' => $data['code']],
                $data
            );
        }
    }
}
