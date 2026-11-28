<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\EducationArticle;
use App\Models\EducationCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    /**
     * Seed 7 kategori edukasi utama sesuai spesifikasi PosyanduKu beserta artikel awal.
     */
    public function run(): void
    {
        $author = User::query()->where('role', UserRole::Admin)->first();

        $categories = [
            [
                'slug' => 'asi-dan-pemberian-makan-bayi',
                'name' => 'ASI dan Pemberian Makan Bayi',
                'description' => 'Panduan menyusui eksklusif, pelekatan, dan pemberian makan bayi usia dini.',
                'sort_order' => 1,
                'article' => [
                    'slug' => 'panduan-asi-eksklusif-6-bulan-pertama',
                    'title' => 'Panduan ASI Eksklusif untuk 6 Bulan Pertama Kehidupan',
                    'excerpt' => 'Langkah praktis mendukung pemberian ASI eksklusif sejak inisiasi menyusu dini hingga usia 6 bulan.',
                    'content' => "ASI eksklusif selama 6 bulan pertama membantu memenuhi seluruh kebutuhan gizi dan cairan bayi. Pastikan posisi menyusui nyaman, pelekatan mulut bayi mencakup sebagian besar areola, dan susui bayi sesuai kebutuhannya.\n\nJika Ibu menemui kendala menyusui seperti nyeri atau kekhawatiran kecukupan ASI, catat pola menyusui harian dan diskusikan bersama kader posyandu atau bidan di fasilitas kesehatan terdekat.",
                    'min_age_months' => 0,
                    'max_age_months' => 6,
                    'reading_time_minutes' => 4,
                    'is_featured' => true,
                ],
            ],
            [
                'slug' => 'mpasi',
                'name' => 'MPASI',
                'description' => 'Tahapan pengenalan makanan pendamping ASI sesuai usia, tekstur, dan porsi.',
                'sort_order' => 2,
                'article' => [
                    'slug' => 'tahapan-tekstur-mpasi-usia-6-sampai-24-bulan',
                    'title' => 'Tahapan Tekstur dan Frekuensi MPASI Usia 6–24 Bulan',
                    'excerpt' => 'Kenali perubahan tekstur MPASI dari bubur kental hingga makanan keluarga agar nafsu makan anak terjaga.',
                    'content' => "Mulai usia 6 bulan, ASI saja tidak lagi mencukupi seluruh kebutuhan energi dan zat besi bayi. Berikan MPASI yang adekuat dengan komposisi karbohidrat, protein hewani, lemak tambahan, serta sayur atau buah secukupnya.\n\nNaikkan tekstur secara bertahap: bubur kental lumat (6–8 bulan), makanan cincang halus/lunak (9–11 bulan), hingga makanan keluarga yang dipotong kecil (12–24 bulan).",
                    'min_age_months' => 6,
                    'max_age_months' => 24,
                    'reading_time_minutes' => 5,
                    'is_featured' => true,
                ],
            ],
            [
                'slug' => 'makanan-bergizi-biaya-terjangkau',
                'name' => 'Makanan Bergizi dengan Biaya Terjangkau',
                'description' => 'Inspirasi menu padat gizi menggunakan bahan pangan lokal yang ramah anggaran.',
                'sort_order' => 3,
                'article' => [
                    'slug' => 'menu-padat-protein-hewani-bahan-lokal-terjangkau',
                    'title' => 'Inspirasi Menu Padat Protein Hewani dengan Bahan Lokal Terjangkau',
                    'excerpt' => 'Telur, ikan kembung, hati ayam, dan tempe dapat diolah menjadi menu bergizi seimbang setiap hari.',
                    'content' => "Memenuhi gizi seimbang balita tidak harus mahal. Bahan pangan lokal seperti telur ayam, ikan kembung, ikan lele, hati ayam, tahu, tempe, dan sayuran musiman kaya akan protein, zat besi, dan mikronutrien penting.\n\nKombinasikan satu porsi makanan pokok, satu sumber protein hewani di setiap waktu makan, serta tambahan minyak atau santan secukupnya untuk membantu kecukupan energi harian anak.",
                    'min_age_months' => 6,
                    'max_age_months' => 60,
                    'reading_time_minutes' => 4,
                    'is_featured' => false,
                ],
            ],
            [
                'slug' => 'imunisasi-anak',
                'name' => 'Imunisasi Anak',
                'description' => 'Informasi jadwal imunisasi rutin Kemenkes dan persiapan sebelum imunisasi.',
                'sort_order' => 4,
                'article' => [
                    'slug' => 'mengapa-imunisasi-rutin-lengkap-penting-bagi-balita',
                    'title' => 'Mengenal Jadwal Imunisasi Rutin Lengkap Sesuai Pedoman Kemenkes',
                    'excerpt' => 'Ringkasan jenis imunisasi dasar dan lanjutan serta hal yang perlu disiapkan orang tua sebelum ke posyandu.',
                    'content' => "Imunisasi rutin lengkap membantu membangun kekebalan tubuh anak terhadap berbagai penyakit yang dapat dicegah dengan imunisasi. Bawa selalu Buku KIA saat kunjungan agar petugas kesehatan dapat mencatat dan memverifikasi setiap dosis.\n\nJika jadwal imunisasi sempat tertunda, segera konsultasikan dengan bidan atau puskesmas untuk penjadwalan kejar imunisasi yang aman.",
                    'min_age_months' => 0,
                    'max_age_months' => 24,
                    'reading_time_minutes' => 4,
                    'is_featured' => false,
                ],
            ],
            [
                'slug' => 'pertumbuhan-dan-perkembangan-balita',
                'name' => 'Pertumbuhan dan Perkembangan Balita',
                'description' => 'Cara membaca grafik pertumbuhan bulanan dan menstimulasi perkembangan balita.',
                'sort_order' => 5,
                'article' => [
                    'slug' => 'cara-memantau-tren-berat-dan-tinggi-badan-di-posyandu',
                    'title' => 'Cara Memahami Tren Berat dan Tinggi Badan Anak Setiap Bulan',
                    'excerpt' => 'Pelajari mengapa pemantauan rutin setiap bulan lebih bermakna dibandingkan melihat satu angka saja.',
                    'content' => "Penimbangan berat badan dan pengukuran tinggi badan secara rutin setiap bulan membantu orang tua melihat arah pertumbuhan anak. Apabila berat badan belum meningkat dibanding bulan sebelumnya, catat pola makan dan kondisi kesehatan anak untuk dibahas bersama kader dan tenaga kesehatan.\n\nIngat, grafik di aplikasi berfungsi sebagai alat pemantauan awal, sementara evaluasi medis tetap dilakukan oleh tenaga kesehatan berwenang.",
                    'min_age_months' => 0,
                    'max_age_months' => 60,
                    'reading_time_minutes' => 5,
                    'is_featured' => false,
                ],
            ],
            [
                'slug' => 'tanda-bahaya-kesehatan-anak',
                'name' => 'Tanda Bahaya Kesehatan Anak',
                'description' => 'Mengenali gejala awal yang memerlukan pemeriksaan segera ke fasilitas kesehatan.',
                'sort_order' => 6,
                'article' => [
                    'slug' => 'tanda-bahaya-balita-yang-perlu-segera-diperiksakan',
                    'title' => 'Tanda Bahaya pada Balita yang Perlu Segera Diperiksakan ke Fasilitas Kesehatan',
                    'excerpt' => 'Kenali tanda bahaya umum pada balita agar orang tua dapat bertindak cepat dan tepat.',
                    'content' => "Segera bawa anak ke puskesmas atau fasilitas kesehatan terdekat apabila anak tampak sangat lemas, sulit dibangunkan, tidak mau menyusu/minum sama sekali, muntah terus-menerus, napas cepat atau sesak, demam tinggi disertai kejang, atau diare dengan tanda dehidrasi.\n\nArtikel ini bersifat informasi pendampingan umum dan tidak menggantikan pemeriksaan dokter atau tenaga kesehatan.",
                    'min_age_months' => 0,
                    'max_age_months' => 60,
                    'reading_time_minutes' => 3,
                    'is_featured' => false,
                ],
            ],
            [
                'slug' => 'panduan-perawatan-dan-pendampingan-anak',
                'name' => 'Panduan Perawatan dan Pendampingan Anak',
                'description' => 'Kebiasaan sehat harian, kebersihan, stimulasi bermain, dan persiapan kunjungan posyandu.',
                'sort_order' => 7,
                'article' => [
                    'slug' => 'persiapan-praktis-sebelum-mengunjungi-posyandu',
                    'title' => 'Persiapan Praktis Orang Tua Sebelum, Saat, dan Setelah Kunjungan Posyandu',
                    'excerpt' => 'Checklist sederhana agar kunjungan posyandu berjalan lancar dan orang tua mendapat informasi maksimal.',
                    'content' => "Sebelum berangkat ke posyandu, pastikan jadwal dan lokasi sudah dicek, Buku KIA tersimpan di tas, dan anak mengenakan pakaian yang mudah dilepas saat penimbangan. Siapkan pula daftar pertanyaan singkat seputar makan, tidur, atau imunisasi anak.\n\nSetelah pengukuran selesai, periksa hasil catatan bersama kader dan jadwalkan tindak lanjut bila dianjurkan oleh petugas kesehatan.",
                    'min_age_months' => 0,
                    'max_age_months' => 60,
                    'reading_time_minutes' => 3,
                    'is_featured' => false,
                ],
            ],
        ];

        foreach ($categories as $item) {
            $articleData = $item['article'];
            unset($item['article']);

            $category = EducationCategory::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    ...$item,
                    'is_active' => true,
                ]
            );

            EducationArticle::query()->updateOrCreate(
                ['slug' => $articleData['slug']],
                [
                    ...$articleData,
                    'education_category_id' => $category->id,
                    'author_id' => $author?->id,
                    'is_published' => true,
                    'published_at' => now(),
                ]
            );
        }
    }
}
