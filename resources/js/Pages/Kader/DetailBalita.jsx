import React from 'react';
import { Link } from '@inertiajs/react';
import SidebarKader from '../../Components/layout/SidebarKader';

const DETAIL_BALITA_MAP = {
  'aruna-putri': {
    id: 1,
    nama: 'Aruna Putri',
    usia: '18 bulan',
    jenisKelamin: 'Perempuan',
    wali: 'Nadia Putri',
    beratTerakhir: '10,2 kg',
    tanggalBerat: '10 Nov 2026',
    tinggiTerakhir: '80,5 cm',
    posisiUkur: 'Berbaring',
    totalKunjungan: '6 kali',
    tahunKunjungan: '2026',
    riwayat: [
      {
        id: 1,
        tanggal: '10 Nov 2026',
        berat: '10,2',
        tinggi: '80,5',
        petugas: 'Siti Rahmawati',
        catatan: 'Konsultasi lanjutan dijadwalkan',
      },
      {
        id: 2,
        tanggal: '10 Okt 2026',
        berat: '10,2',
        tinggi: '79,8',
        petugas: 'Siti Rahmawati',
        catatan: 'Hasil penimbangan sesuai KMS',
      },
      {
        id: 3,
        tanggal: '10 Sep 2026',
        berat: '9,8',
        tinggi: '79,2',
        petugas: 'Siti Rahmawati',
        catatan: 'Imunisasi rutin lengkap',
      },
      {
        id: 4,
        tanggal: '10 Agu 2026',
        berat: '9,6',
        tinggi: '78,4',
        petugas: 'Siti Rahmawati',
        catatan: 'Pemantauan berat badan rutin',
      },
      {
        id: 5,
        tanggal: '10 Jul 2026',
        berat: '9,4',
        tinggi: '77,8',
        petugas: 'Siti Rahmawati',
        catatan: 'Pemberian vitamin A & ukur tinggi',
      },
      {
        id: 6,
        tanggal: '10 Jun 2026',
        berat: '9,0',
        tinggi: '77,0',
        petugas: 'Siti Rahmawati',
        catatan: 'Penimbangan bulanan rutin',
      },
    ],
  },
  'bima-pratama': {
    id: 2,
    nama: 'Bima Pratama',
    usia: '24 bulan',
    jenisKelamin: 'Laki-laki',
    wali: 'Dewi Pratama',
    beratTerakhir: '11,4 kg',
    tanggalBerat: '10 Sep 2026',
    tinggiTerakhir: '85,2 cm',
    posisiUkur: 'Berdiri',
    totalKunjungan: '4 kali',
    tahunKunjungan: '2026',
    riwayat: [
      {
        id: 1,
        tanggal: '10 Sep 2026',
        berat: '11,4',
        tinggi: '85,2',
        petugas: 'Siti Rahmawati',
        catatan: 'Perlu pendampingan kehadiran rutin',
      },
      {
        id: 2,
        tanggal: '10 Agu 2026',
        berat: '11,2',
        tinggi: '84,6',
        petugas: 'Siti Rahmawati',
        catatan: 'Pemantauan berat badan rutin',
      },
      {
        id: 3,
        tanggal: '10 Jul 2026',
        berat: '11,0',
        tinggi: '84,0',
        petugas: 'Siti Rahmawati',
        catatan: 'Pemberian vitamin A & ukur tinggi',
      },
      {
        id: 4,
        tanggal: '10 Jun 2026',
        berat: '10,8',
        tinggi: '83,5',
        petugas: 'Siti Rahmawati',
        catatan: 'Penimbangan bulanan rutin',
      },
    ],
  },
  'naila-safira': {
    id: 3,
    nama: 'Naila Safira',
    usia: '12 bulan',
    jenisKelamin: 'Perempuan',
    wali: 'Rizal Safira',
    beratTerakhir: '8,9 kg',
    tanggalBerat: '10 Nov 2026',
    tinggiTerakhir: '74,0 cm',
    posisiUkur: 'Berbaring',
    totalKunjungan: '6 kali',
    tahunKunjungan: '2026',
    riwayat: [
      {
        id: 1,
        tanggal: '10 Nov 2026',
        berat: '8,9',
        tinggi: '74,0',
        petugas: 'Siti Rahmawati',
        catatan: 'Cek jadwal imunisasi campak',
      },
      {
        id: 2,
        tanggal: '10 Okt 2026',
        berat: '8,7',
        tinggi: '73,2',
        petugas: 'Siti Rahmawati',
        catatan: 'Hasil penimbangan sesuai KMS',
      },
      {
        id: 3,
        tanggal: '10 Sep 2026',
        berat: '8,4',
        tinggi: '72,5',
        petugas: 'Siti Rahmawati',
        catatan: 'Pemantauan berat badan rutin',
      },
    ],
  },
};

const DetailBalita = ({ slug }) => {
  const balita =
    (slug && DETAIL_BALITA_MAP[slug]) || DETAIL_BALITA_MAP['aruna-putri'];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      <SidebarKader />

      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        <nav
          aria-label="Breadcrumb"
          className="text-[12.5px] font-medium text-[#334155] flex flex-wrap items-center gap-1"
        >
          <Link
            href="/kader/dashboard"
            className="hover:text-[#2E5780] transition-colors"
          >
            Kader
          </Link>
          <span>/</span>
          <Link
            href="/kader/data-balita"
            className="hover:text-[#2E5780] transition-colors"
          >
            Data balita
          </Link>
          <span>/</span>
          <span className="text-[#1D3B58] font-semibold">{balita.nama}</span>
        </nav>

        <div className="mt-3">
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
            {balita.nama}
          </h1>
          <p className="mt-1 text-[14px] font-medium text-[#334155]">
            {balita.usia} • {balita.jenisKelamin} • Wali: {balita.wali}
          </p>
        </div>

        {/* 3 Kartu Ringkasan Pengukuran */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-[#B5D5F0] rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[128px]">
            <p className="text-[13.5px] font-medium text-[#1D3B58]">
              Berat terakhir
            </p>
            <p className="my-1.5 text-[30px] sm:text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {balita.beratTerakhir}
            </p>
            <p className="text-[12.5px] font-medium text-[#1D3B58]/85">
              {balita.tanggalBerat}
            </p>
          </div>

          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[128px]">
            <p className="text-[13.5px] font-medium text-[#334155]">
              Tinggi terakhir
            </p>
            <p className="my-1.5 text-[30px] sm:text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {balita.tinggiTerakhir}
            </p>
            <p className="text-[12.5px] font-medium text-[#475569]">
              {balita.posisiUkur}
            </p>
          </div>

          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[128px]">
            <p className="text-[13.5px] font-medium text-[#334155]">
              Riwayat kunjungan
            </p>
            <p className="my-1.5 text-[30px] sm:text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {balita.totalKunjungan}
            </p>
            <p className="text-[12.5px] font-medium text-[#475569]">
              {balita.tahunKunjungan}
            </p>
          </div>
        </section>

        {/* Tabel Riwayat & Pendampingan */}
        <section className="mt-6 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-4">
            Riwayat &amp; pendampingan
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                  <th className="py-3 px-4 rounded-l-[10px]">Tanggal</th>
                  <th className="py-3 px-4 text-center">Berat (kg)</th>
                  <th className="py-3 px-4 text-center">Tinggi (cm)</th>
                  <th className="py-3 px-4 text-center">Petugas</th>
                  <th className="py-3 px-4 text-center rounded-r-[10px]">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                {balita.riwayat.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-3.5 px-4 text-center">{item.berat}</td>
                    <td className="py-3.5 px-4 text-center">{item.tinggi}</td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {item.petugas}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block max-w-[180px] leading-snug">
                        {item.catatan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetailBalita;