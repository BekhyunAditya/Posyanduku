import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SidebarKader from '../../components/layout/SidebarKader';

export const JADWAL_STORAGE_KEY = 'posyanduku_kader_jadwal';

export const INITIAL_JADWAL_KEGIATAN = [
  {
    id: 1,
    kegiatan: 'Penimbangan & pelayanan balita',
    tanggal: '10 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '08.00 - 11.00',
    lokasi: 'Posyandu Melati 01',
    status: 'Selesai',
  },
  {
    id: 2,
    kegiatan: 'Edukasi keluarga',
    tanggal: '12 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '09.00–11.00',
    lokasi: 'Posyandu Melati 01',
    status: 'Selesai',
  },
  {
    id: 3,
    kegiatan: 'Penyuluhan Kesehatan',
    tanggal: '16 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '08.00–11.00',
    lokasi: 'Posyandu Melati 01',
    status: 'Selesai',
  },
  {
    id: 4,
    kegiatan: 'Pemeriksaan ibu hamil',
    tanggal: '18 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '09.00–11.30',
    lokasi: 'Posyandu Melati 01',
    status: 'Terjadwal',
  },
  {
    id: 5,
    kegiatan: 'Penimbangan & pelayanan balita',
    tanggal: '20 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '08.00 - 11.00',
    lokasi: 'Posyandu Melati 01',
    status: 'Terjadwal',
  },
  {
    id: 6,
    kegiatan: 'Pelayanan Kesehatan Anak',
    tanggal: '24 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '08.00–10.30',
    lokasi: 'Posyandu Melati 01',
    status: 'Terjadwal',
  },
  {
    id: 7,
    kegiatan: 'Penyuluhan gizi untuk orang tua',
    tanggal: '27 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '08.00–10.30',
    lokasi: 'Posyandu Melati 01',
    status: 'Terjadwal',
  },
  {
    id: 8,
    kegiatan: 'Pemberian imunsiasti balita',
    tanggal: '30 Nov 2026',
    bulan: 'November',
    tahun: '2026',
    waktu: '08.00–11.00',
    lokasi: 'Posyandu Melati 01',
    status: 'Terjadwal',
  },
  {
    id: 9,
    kegiatan: 'Penimbangan & pelayanan balita',
    tanggal: '10 Okt 2026',
    bulan: 'Oktober',
    tahun: '2026',
    waktu: '08.00 - 11.00',
    lokasi: 'Posyandu Melati 01',
    status: 'Selesai',
  },
  {
    id: 10,
    kegiatan: 'Posyandu Rutin & Vitamin A',
    tanggal: '15 Des 2026',
    bulan: 'Desember',
    tahun: '2026',
    waktu: '08.00 - 11.00',
    lokasi: 'Posyandu Melati 01',
    status: 'Terjadwal',
  },
];

const BULAN_OPTIONS = ['Oktober', 'November', 'Desember'];
const TAHUN_OPTIONS = ['2026', '2025'];

const JadwalKegiatan = () => {
  const navigate = useNavigate();

  const [selectedBulan, setSelectedBulan] = useState('November');
  const [selectedTahun, setSelectedTahun] = useState('2026');
  const [bulanDropdownOpen, setBulanDropdownOpen] = useState(false);
  const [tahunDropdownOpen, setTahunDropdownOpen] = useState(false);

  const jadwalList = useMemo(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(JADWAL_STORAGE_KEY) || '[]'
      );
      if (Array.isArray(saved) && saved.length > 0) {
        return [...saved, ...INITIAL_JADWAL_KEGIATAN];
      }
    } catch {
      // Gunakan daftar default jika localStorage tidak tersedia
    }
    return INITIAL_JADWAL_KEGIATAN;
  }, []);

  const filteredJadwal = useMemo(() => {
    return jadwalList.filter(
      (item) =>
        item.bulan === selectedBulan && String(item.tahun) === selectedTahun
    );
  }, [jadwalList, selectedBulan, selectedTahun]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      {/* Sidebar Kiri (Menu "Jadwal Kegiatan" aktif) */}
      <SidebarKader />

      {/* Konten Utama Kanan */}
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-[12.5px] font-medium text-[#334155] flex items-center gap-1"
        >
          <Link
            to="/kader/dashboard"
            className="hover:text-[#2E5780] transition-colors"
          >
            Kader
          </Link>
          <span>/</span>
          <span className="text-[#1D3B58] font-semibold">Jadwal kegiatan</span>
        </nav>

        {/* Header Halaman */}
        <div className="mt-3">
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
            Jadwal Kegiatan
          </h1>
          <p className="mt-1 text-[14px] text-[#475569]">
            Buat jadwal dan pantau kunjungan
          </p>
        </div>

        {/* 2 Tombol Aksi Atas */}
        <div className="mt-5 flex flex-wrap items-center gap-3.5">
          <Link
            to="/kader/jadwal-kegiatan/tambah"
            className="bg-[#2E5780] hover:bg-[#234466] text-white text-[14.5px] font-bold px-8 py-3 rounded-full shadow-xs transition-colors duration-200"
          >
            Tambah kegiatan
          </Link>

          <Link
            to="/kader/jadwal-kegiatan/kunjungan"
            className="bg-white hover:bg-slate-50 text-[#1D3B58] border border-[#2E5780]/75 text-[14.5px] font-bold px-8 py-3 rounded-full transition-colors duration-200"
          >
            Lihat kunjungan
          </Link>
        </div>

        {/* Kartu Putih Tabel Jadwal Kegiatan */}
        <section className="mt-6 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {/* Filter Bulan & Tahun */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Dropdown Bulan */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setBulanDropdownOpen((prev) => !prev);
                  setTahunDropdownOpen(false);
                }}
                className="min-w-[148px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-2 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <span>{selectedBulan}</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                    bulanDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {bulanDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                  {BULAN_OPTIONS.map((bulan) => (
                    <button
                      key={bulan}
                      type="button"
                      onClick={() => {
                        setSelectedBulan(bulan);
                        setBulanDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                        selectedBulan === bulan
                          ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                          : 'text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      {bulan}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Tahun */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setTahunDropdownOpen((prev) => !prev);
                  setBulanDropdownOpen(false);
                }}
                className="min-w-[112px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-2 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <span>{selectedTahun}</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                    tahunDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {tahunDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-32 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                  {TAHUN_OPTIONS.map((tahun) => (
                    <button
                      key={tahun}
                      type="button"
                      onClick={() => {
                        setSelectedTahun(tahun);
                        setTahunDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                        selectedTahun === tahun
                          ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                          : 'text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      {tahun}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabel Jadwal */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                  <th className="py-3 px-4 rounded-l-[10px]">Kegiatan</th>
                  <th className="py-3 px-4 text-center">Tanggal</th>
                  <th className="py-3 px-4 text-center">Waktu</th>
                  <th className="py-3 px-4 text-center">Lokasi</th>
                  <th className="py-3 px-4 text-center rounded-r-[10px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                {filteredJadwal.length > 0 ? (
                  filteredJadwal.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => navigate('/kader/jadwal-kegiatan/kunjungan')}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-medium">
                        {row.kegiatan}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {row.tanggal}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {row.waktu}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block max-w-[115px] leading-snug">
                          {row.lokasi}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {row.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      Belum ada jadwal kegiatan pada bulan {selectedBulan}{' '}
                      {selectedTahun}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Banner Info Bawah */}
        <section className="mt-6 bg-[#B5D5F0] rounded-[16px] px-6 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[#1D3B58]">
          <p className="text-[13.5px] font-bold">Pengingat di dalam website</p>
          <p className="mt-1 text-[13.5px] font-medium leading-relaxed">
            Jadwal yang diterbitkan muncul pada kalender orang tua dan daftar
            pengingat.
          </p>
        </section>
      </main>
    </div>
  );
};

export default JadwalKegiatan;