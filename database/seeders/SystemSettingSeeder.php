<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Seed pengaturan dasar website PosyanduKu.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'site_name',
                'value' => 'PosyanduKu',
                'type' => 'string',
                'group' => 'general',
                'label' => 'Nama Website',
                'description' => 'Nama resmi platform yang ditampilkan di antarmuka.',
            ],
            [
                'key' => 'site_tagline',
                'value' => 'Lebih Mudah Memantau, Lebih Tenang Mendampingi.',
                'type' => 'string',
                'group' => 'general',
                'label' => 'Tagline Website',
                'description' => 'Tagline utama PosyanduKu.',
            ],
            [
                'key' => 'medical_disclaimer',
                'value' => 'PosyanduKu berfungsi sebagai alat pemantauan dan pendampingan kesehatan balita, bukan alat diagnosis medis. Konsultasikan hasil pengukuran dengan kader atau tenaga kesehatan berwenang.',
                'type' => 'string',
                'group' => 'compliance',
                'label' => 'Disclaimer Non-Diagnosis Medis',
                'description' => 'Pernyataan batasan sistem yang ditampilkan pada halaman pertumbuhan dan panduan tindakan.',
            ],
            [
                'key' => 'buku_kia_disclaimer',
                'value' => 'Buku KIA Digital ini berfungsi sebagai pendamping dan bukan pengganti Buku KIA resmi dari fasilitas kesehatan.',
                'type' => 'string',
                'group' => 'compliance',
                'label' => 'Disclaimer Buku KIA Pendamping',
                'description' => 'Pernyataan batasan pada halaman Buku KIA Digital Pendamping.',
            ],
            [
                'key' => 'notifications_in_app_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'label' => 'Notifikasi In-App Aktif',
                'description' => 'Mengaktifkan pengingat jadwal posyandu, imunisasi, pengukuran, dan tindak lanjut di dalam website.',
            ],
            [
                'key' => 'kader_requires_admin_verification',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'security',
                'label' => 'Verifikasi Kader oleh Admin',
                'description' => 'Akun kader baru harus diverifikasi admin sebelum mengakses fitur pencatatan balita.',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::query()->updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
