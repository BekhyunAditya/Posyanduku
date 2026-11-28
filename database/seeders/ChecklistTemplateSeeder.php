<?php

namespace Database\Seeders;

use App\Models\ChecklistTemplate;
use Illuminate\Database\Seeder;

class ChecklistTemplateSeeder extends Seeder
{
    /**
     * 4 langkah inti Checklist Kesiapan Posyandu sesuai spesifikasi Bagian 4.3.
     */
    public function run(): void
    {
        $steps = [
            [
                'phase' => 'sebelum',
                'title' => 'Periksa jadwal dan lokasi posyandu',
                'description' => 'Pastikan tanggal, jam layanan, lokasi posyandu, dan jenis kegiatan yang akan diikuti.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'phase' => 'sebelum',
                'title' => 'Siapkan Buku KIA dan perlengkapan anak',
                'description' => 'Bawa Buku KIA resmi, kartu identitas/KK jika diminta, pakaian nyaman untuk ditimbang, dan catatan pertanyaan konsultasi.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'phase' => 'saat',
                'title' => 'Datang untuk pengukuran atau pelayanan',
                'description' => 'Ikuti tahapan pendaftaran, penimbangan berat badan, pengukuran panjang/tinggi badan, dan layanan sesuai jadwal.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'phase' => 'sesudah',
                'title' => 'Lihat hasil pemeriksaan dan arahan tindak lanjut',
                'description' => 'Periksa ringkasan pertumbuhan anak di PosyanduKu serta catat arahan kader atau tenaga kesehatan untuk kunjungan berikutnya.',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($steps as $step) {
            ChecklistTemplate::query()->updateOrCreate(
                ['sort_order' => $step['sort_order']],
                $step
            );
        }
    }
}
