import React from 'react';
import { Link } from '@inertiajs/react';
import NavbarOrtu from '../../Components/layout/NavbarOrtu';

const LANGKAH_TINDAKAN = [
  {
    nomor: '01',
    judul: 'Periksa kembali catatan',
    deskripsi:
      'Cocokkan tanggal dan hasil pengukuran terakhir. Jika ada kekeliruan, minta kader memeriksa catatan.',
    labelTombol: 'Lihat riwayat',
    href: '/ortu/pertumbuhan',
  },
  {
    nomor: '02',
    judul: 'Catat pola makan anak',
    deskripsi:
      'Tuliskan waktu makan, makanan yang diberikan, dan hal yang ingin ditanyakan saat konsultasi.',
    labelTombol: 'Siapkan catatan',
    href: '/ortu/panduan-kunjungan/catatan',
  },
  {
    nomor: '03',
    judul: 'Bahas bersama petugas',
    deskripsi:
      'Konsultasikan catatan kepada kader dan tenaga kesehatan saat kunjungan berikutnya.',
    labelTombol: 'Lihat jadwal',
    href: '/ortu/jadwal-posyandu',
  },
  {
    nomor: '04',
    judul: 'Baca panduan sesuai usia',
    deskripsi:
      'Temukan materi pendamping tentang pemberian makanan sesuai usia dan kebutuhan anak.',
    labelTombol: 'Buka materi edukasi',
    href: '/edukasi',
  },
];

const DEFAULT_CATATAN_TERAKHIR = {
  status: 'Berat Badan Belum Meningkat',
  periode: '10 Okt – 10 Nov 2026',
  rekomendasi:
    'Anak perlu diberikan asupan gizi khusus dengan susu formula agar berat badannya bisa bertambah dengan normal',
};

const PanduanTindakanPersonal = ({ catatanTerakhir }) => {
  const catatan = catatanTerakhir || DEFAULT_CATATAN_TERAKHIR;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar Floating Kapsul Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_0.95fr] gap-8 lg:gap-10 items-center">
          {/* ================= KARTU KIRI: PANDUAN TINDAKAN ================= */}
          <section className="bg-white rounded-[28px] p-7 sm:p-10 lg:p-11 shadow-[0_6px_24px_rgba(0,0,0,0.05)] border border-slate-100/80">
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#234B72] tracking-tight leading-tight">
              Panduan Tindakan
            </h1>
            <p className="mt-2 text-[14.5px] sm:text-[15.5px] font-medium text-[#234B72] max-w-[360px] leading-snug">
              Beberapa langkah sederhana yang bisa disiapkan sebelum
              berkonsultasi
            </p>

            {/* Daftar 4 Langkah Tindakan */}
            <div className="mt-8 space-y-7">
              {LANGKAH_TINDAKAN.map((item) => (
                <div key={item.nomor}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-[19px] sm:text-[21px] font-extrabold text-[#234B72] tabular-nums">
                      {item.nomor}
                    </span>
                    <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1E293B]">
                      {item.judul}
                    </h2>
                  </div>

                  <p className="mt-2 text-[12.5px] sm:text-[13px] text-[#334155] leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="mt-3.5">
                    <Link
                      href={item.href}
                      className="inline-flex items-center justify-center min-w-[172px] bg-[#F5F3EE] hover:bg-[#EAE6DC] text-[#1E293B] text-[12px] font-medium px-6 py-2.5 rounded-full transition-colors duration-200"
                    >
                      {item.labelTombol}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= KOLOM KANAN: CATATAN TERAKHIR ================= */}
          <aside className="flex flex-col items-center">
            <div className="w-full bg-white rounded-[28px] px-7 py-9 sm:px-8 sm:py-10 shadow-[0_6px_24px_rgba(0,0,0,0.05)] border border-slate-100/80 text-center">
              <h2 className="text-[22px] sm:text-[24px] font-bold text-[#234B72]">
                Catatan Terakhir
              </h2>

              <p className="mt-3 text-[22px] sm:text-[25px] font-extrabold text-[#F3831E] leading-tight">
                {catatan.status}
              </p>

              <p className="mt-3.5 text-[20px] sm:text-[22px] font-extrabold italic text-[#234B72]">
                {catatan.periode}
              </p>

              <p className="mt-4 text-[14px] sm:text-[15px] font-medium text-[#234B72] leading-relaxed max-w-[285px] mx-auto">
                {catatan.rekomendasi}
              </p>
            </div>

            {/* Tombol Kembali ke Beranda */}
            <Link
              href="/ortu/dashboard"
              className="mt-6 inline-flex items-center justify-center bg-white hover:bg-[#2E5780] text-[#234B72] hover:text-white border border-[#2E5780]/70 text-[14px] font-semibold px-9 py-2.5 rounded-full transition-colors duration-200"
            >
              Kembali ke Beranda
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PanduanTindakanPersonal;