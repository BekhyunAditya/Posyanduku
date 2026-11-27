import ibuDanAnakImg from '@/Assets/images/ibu-dan-anak.png';
import edukasiBalitaImg from '@/Assets/images/edukasi-balita.png';
import makananBergiziImg from '@/Assets/images/makanan-bergizi.png';

import bannerIbuAnakImg from '@/Assets/images/banner-ibu-dan-anak.png';
import bannerBayiImg from '@/Assets/images/banner-bayi.png';
import bannerMakananImg from '@/Assets/images/banner-makanan.png';

export const EDUKASI_CATEGORIES = [
  'Semua Topik',
  'ASI',
  'Mpasi',
  'Gizi Terjangkau',
  'Imunisasi',
  'Pertumbuhan',
];

export const EDUKASI_ARTICLES = [
  {
    slug: 'membawa-catatan-kecil-konsultasi',
    featured: true,
    kategori: 'Panduan Keluarga',
    filterTopik: 'Semua Topik',
    judul: 'Membawa catatan kecil, membuat konsultasi berarah',
    ringkasan:
      'Siapkan pertanyaan dan riwayat anak sebelum kunjungan berikutnya',
    ctaText: 'Baca panduan →',
    image: ibuDanAnakImg,
    bannerImage: bannerIbuAnakImg,
    steps: [
      {
        number: '01',
        title: 'Sebelum Berangkat',
        description:
          'Siapkan buku KIA dan catatan kunjungan sebelumnya agar riwayat anak mudah dibahas bersama petugas',
      },
      {
        number: '02',
        title: 'Tuliskan yang ingin ditanyakan',
        description:
          'Catat perubahan yang kamu amati, hal yang belum dipahami, serta pertanyaan tentang makan, pertumbuhan, atau jadwal pelayanan anak.',
      },
    ],
    closingNote:
      'Catat perubahan yang kamu amati, hal yang belum dipahami, serta pertanyaan tentang makan, pertumbuhan, atau jadwal pelayanan anak.',
  },
  {
    slug: 'mengenal-kebutuhan-makan-anak',
    featured: false,
    kategori: 'Mpasi',
    filterTopik: 'Mpasi',
    judul: 'Mengenal Kebutuhan makan anak',
    ringkasan: 'Materi menurut kelompok usia anak',
    ctaText: 'Buka materi →',
    image: edukasiBalitaImg,
    bannerImage: bannerBayiImg,
    steps: [
      {
        number: '01',
        title: 'Pilih Tekstur Lembut & Pendamping Sehat',
        description:
          'Sajikan puree sayur atau buah bertekstur lembut serta pilihan pendamping seperti plain yogurt tanpa pemanis tambahan sesuai tahap usia dan kesiapan makan anak.',
      },
      {
        number: '02',
        title: 'Biasakan Duduk di Kursi Makan',
        description:
          'Dudukkan anak dengan posisi tegak di kursi makan menggunakan mangkuk dan sendok khusus agar anak fokus mengenal rasa serta belajar makan mandiri.',
      },
    ],
    closingNote:
      'Biarkan anak bereksplorasi dengan makanannya secara bertahap sambil tetap didampingi orang tua untuk mengamati respons kenyang dan tanda alergi.',
  },
  {
    slug: 'ide-bahan-pangan-keluarga',
    featured: false,
    kategori: 'Gizi Terjangkau',
    filterTopik: 'Gizi Terjangkau',
    judul: 'Ide bahan pangan keluarga',
    ringkasan: 'Kenali bahan yang mudah ditemukan',
    ctaText: 'Buka materi →',
    image: makananBergiziImg,
    bannerImage: bannerMakananImg,
    steps: [
      {
        number: '01',
        title: 'Kombinasikan Nasi & Telur sebagai Sumber Energi',
        description:
          'Sajikan nasi putih secukupnya sebagai karbohidrat utama, lalu lengkapi dengan telur rebus yang praktis diolah serta kaya protein dan zat besi untuk tumbuh kembang anak.',
      },
      {
        number: '02',
        title: 'Lengkapi Piring dengan Sayur & Buah Segar',
        description:
          'Tambahkan potongan sayuran seperti wortel dan sayur hijau bersama buah jeruk sebagai sumber serat serta vitamin harian dalam satu piring makan seimbang.',
      },
    ],
    closingNote:
      'Gunakan pembagian porsi sederhana—karbohidrat, protein hewani, sayur, dan buah—agar kebutuhan gizi anak terpenuhi dari bahan segar yang mudah ditemukan di rumah.',
  },
  {
    slug: 'panduan-menyusui-asi-eksklusif',
    featured: false,
    kategori: 'ASI',
    filterTopik: 'ASI',
    judul: 'Menjaga kelancaran ASI di 6 bulan pertama',
    ringkasan: 'Posisi pelekatan dan jadwal menyusui',
    ctaText: 'Buka materi →',
    image: ibuDanAnakImg,
    bannerImage: bannerIbuAnakImg,
    steps: [
      {
        number: '01',
        title: 'Pastikan Pelekatan Sudah Nyaman',
        description:
          'Posisikan perut bayi menempel ke tubuh ibu dengan mulut terbuka lebar mencakup sebagian besar areola agar hisapan efektif.',
      },
      {
        number: '02',
        title: 'Susui Sesuai Kebutuhan Bayi',
        description:
          'Berikan ASI sesering yang diminta bayi (on demand) dan pastikan ibu cukup minum air putih serta beristirahat.',
      },
    ],
    closingNote:
      'Jika mengalami nyeri atau kendala menyusui, segera catat keluhan untuk dibahas bersama kader atau bidan di posyandu.',
  },
  {
    slug: 'persiapan-sebelum-dan-sesudah-imunisasi',
    featured: false,
    kategori: 'Imunisasi',
    filterTopik: 'Imunisasi',
    judul: 'Persiapan sebelum & sesudah imunisasi',
    ringkasan: 'Langkah tenang mendampingi imunisasi rutin',
    ctaText: 'Buka materi →',
    image: ibuDanAnakImg,
    bannerImage: bannerIbuAnakImg,
    steps: [
      {
        number: '01',
        title: 'Pastikan Anak dalam Kondisi Fit',
        description:
          'Sampaikan kepada petugas kesehatan jika anak sedang demam tinggi atau memiliki riwayat reaksi alergi pada imunisasi sebelumnya.',
      },
      {
        number: '02',
        title: 'Perawatan Ringan Pasca Imunisasi',
        description:
          'Berikan ASI atau cairan lebih sering dan kompres hangat area bekas suntikan jika tampak kemerahan ringan.',
      },
    ],
    closingNote:
      'Selalu bawa Buku KIA agar tanggal dan jenis vaksin yang diberikan tercatat serta terverifikasi oleh tenaga kesehatan.',
  },
  {
    slug: 'membaca-arah-kurva-pertumbuhan',
    featured: false,
    kategori: 'Pertumbuhan',
    filterTopik: 'Pertumbuhan',
    judul: 'Memahami arah garis pertumbuhan anak',
    ringkasan: 'Cara membaca kenaikan berat & panjang badan',
    ctaText: 'Buka materi →',
    image: edukasiBalitaImg,
    bannerImage: bannerBayiImg,
    steps: [
      {
        number: '01',
        title: 'Perhatikan Tren Kenaikan Bulanan',
        description:
          'Pertumbuhan yang baik ditandai dengan garis berat badan yang terus naik mengikuti pita warna pada grafik pertumbuhan.',
      },
      {
        number: '02',
        title: 'Cermati Jika Berat Badan Tetap',
        description:
          'Apabila berat badan tidak naik selama dua kali penimbangan berturut-turut, segera diskusikan pola makan anak dengan petugas.',
      },
    ],
    closingNote:
      'Pemantauan rutin setiap bulan membantu orang tua mendeteksi kebutuhan gizi anak lebih dini.',
  },
];