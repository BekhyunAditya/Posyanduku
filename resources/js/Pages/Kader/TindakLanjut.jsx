import React, { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Plus } from 'lucide-react';
import SidebarKader from '../../Components/layout/SidebarKader';

export const TINDAK_LANJUT_STORAGE_KEY = 'posyanduku_kader_tindak_lanjut';

export const INITIAL_TINDAK_LANJUT = [
  {
    id: 1,
    namaAnak: 'Aruna Putri',
    kondisiBadge: 'Berat belum naik',
    kondisiDetail: 'Berat badan belum naik',
    rencana: 'Bahas riwayat berat badan pada konsultasi berikutnya',
    jadwalShort: '20 Nov 2026',
    tanggalLengkap: '20 November 2026',
    petugas: 'Bidan Rina',
    catatan: 'Orang tua harus membawa catatan makan dan buku KIA.',
  },
  {
    id: 2,
    namaAnak: 'Bima Pratama',
    kondisiBadge: 'Imunisasi tertunda',
    kondisiDetail: 'Imunisasi tertunda',
    rencana: 'Koordinasi dengan bidan untuk jadwal kejar.',
    jadwalShort: '30 Nov 2026',
    tanggalLengkap: '30 November 2026',
    petugas: 'Bidan Rina',
    catatan: 'Pastikan kondisi anak sehat dan tidak demam saat imunisasi kejar.',
  },
  {
    id: 3,
    namaAnak: 'Naila Safira',
    kondisiBadge: 'Verifikasi catatan',
    kondisiDetail: 'Verifikasi catatan',
    rencana: 'Cocokkan data buku KIA dengan sistem',
    jadwalShort: '20 Nov 2026',
    tanggalLengkap: '20 November 2026',
    petugas: 'Siti Rahmawati',
    catatan: 'Orang tua diminta membawa Buku KIA fisik saat kunjungan.',
  },
  {
    id: 4,
    namaAnak: 'Raka Aditya',
    kondisiBadge: 'Pemantauan vitamin',
    kondisiDetail: 'Pemantauan vitamin',
    rencana: 'Berikan kapsul vitamin A & penyuluhan MPASI',
    jadwalShort: '27 Nov 2026',
    tanggalLengkap: '27 November 2026',
    petugas: 'Bidan Rina',
    catatan: 'Evaluasi variasi protein hewani pada menu MPASI harian.',
  },
  {
    id: 5,
    namaAnak: 'Kirana Putri',
    kondisiBadge: 'Rawan gizi',
    kondisiDetail: 'Rawan gizi',
    rencana: 'Evaluasi pola makan dan berikan tambahan PMT',
    jadwalShort: '24 Nov 2026',
    tanggalLengkap: '24 November 2026',
    petugas: 'Bidan Rina',
    catatan: 'Jadwalkan pemantauan berat badan mingguan bersama kader.',
  },
  {
    id: 6,
    namaAnak: 'Dimas Saputra',
    kondisiBadge: 'Imunisasi tertunda',
    kondisiDetail: 'Imunisasi tertunda',
    rencana: 'Koordinasi dengan bidan untuk jadwal kejar.',
    jadwalShort: '30 Nov 2026',
    tanggalLengkap: '30 November 2026',
    petugas: 'Bidan Rina',
    catatan: 'Hubungi wali H-1 sebelum jadwal pelayanan Posyandu.',
  },
  {
    id: 7,
    namaAnak: 'Annisa Lestari',
    kondisiBadge: 'Kunjungan ulang',
    kondisiDetail: 'Kunjungan ulang',
    rencana: 'Pantau perkembangan motorik dan tinggi badan.',
    jadwalShort: '20 Nov 2026',
    tanggalLengkap: '20 November 2026',
    petugas: 'Siti Rahmawati',
    catatan: 'Catat perkembangan motorik kasar sesuai checklist usia.',
  },
];

export const toSlug = (nama) =>
  nama
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

export const getKondisiBadgeStyle = (kondisi = '') => {
  const lower = kondisi.toLowerCase();
  if (lower.includes('berat') || lower.includes('gizi')) {
    return 'bg-[#F9D5D3] text-[#1E293B]';
  }
  if (lower.includes('imunisasi')) {
    return 'bg-[#D6E8F8] text-[#1E293B]';
  }
  if (lower.includes('vitamin')) {
    return 'bg-[#D7F7CC] text-[#1E293B]';
  }
  if (lower.includes('verifikasi') || lower.includes('kunjungan')) {
    return 'bg-[#F6D7BC] text-[#1E293B]';
  }
  return 'bg-[#E3EEF8] text-[#1D3B58]';
};

export const getAllTindakLanjut = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(TINDAK_LANJUT_STORAGE_KEY) || '[]'
    );
    if (Array.isArray(saved) && saved.length > 0) {
      const savedMap = new Map(saved.map((item) => [toSlug(item.namaAnak), item]));
      const mergedDefaults = INITIAL_TINDAK_LANJUT.map((item) => {
        const slug = toSlug(item.namaAnak);
        if (savedMap.has(slug)) {
          const updated = savedMap.get(slug);
          savedMap.delete(slug);
          return updated;
        }
        return item;
      });
      return [...savedMap.values(), ...mergedDefaults];
    }
  } catch {
    // Gunakan data bawaan jika localStorage tidak tersedia
  }
  return INITIAL_TINDAK_LANJUT;
};

const TindakLanjut = () => {
  const daftarPendampingan = useMemo(() => getAllTindakLanjut(), []);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      <SidebarKader />

      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-[12.5px] font-medium text-[#334155] flex items-center gap-1"
        >
          <Link
            href="/kader/dashboard"
            className="hover:text-[#2E5780] transition-colors"
          >
            Kader
          </Link>
          <span>/</span>
          <span className="text-[#1D3B58] font-semibold">Tindak Lanjut</span>
        </nav>

        {/* Header Halaman */}
        <div className="mt-3">
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
            Rencana tindak lanjut
          </h1>
          <p className="mt-1 text-[14px] text-[#475569]">
            Pantau kebutuhan dan tindak lanjut balita.
          </p>
        </div>

        {/* Kartu Daftar Pendampingan */}
        <section className="mt-6 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-4">
            Daftar Pendampingan
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-left border-collapse">
              <thead>
                <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                  <th className="py-3 px-4 rounded-l-[10px]">Nama Anak</th>
                  <th className="py-3 px-4 text-center">Kondisi</th>
                  <th className="py-3 px-4 text-center">Tindak Lanjut</th>
                  <th className="py-3 px-4 text-center">Jadwal</th>
                  <th className="py-3 px-4 text-center rounded-r-[10px]">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                {daftarPendampingan.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      {row.namaAnak}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block min-w-[146px] px-3.5 py-1 rounded-full text-[12px] font-medium ${getKondisiBadgeStyle(
                          row.kondisiBadge
                        )}`}
                      >
                        {row.kondisiBadge}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block max-w-[205px] leading-snug">
                        {row.rencana}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {row.jadwalShort}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/kader/tindak-lanjut/${toSlug(row.namaAnak)}`}
                        className="inline-flex items-center gap-1.5 bg-[#2E5780] hover:bg-[#234466] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full transition-colors duration-200"
                      >
                        <span>Lihat detail</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tombol + Tambah pendampingan */}
          <div className="mt-6 pt-1">
            <Link
              href="/kader/tindak-lanjut/tambah"
              className="inline-flex items-center gap-2 bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-7 py-3 rounded-full shadow-xs transition-colors duration-200"
            >
              <Plus className="w-4 h-4 stroke-[2.8]" />
              <span>Tambah pendampingan</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TindakLanjut;