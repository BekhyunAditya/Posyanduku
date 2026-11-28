import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarKader from '../../Components/layout/SidebarKader';

const INITIAL_KEHADIRAN_LIST = (() => {
  const firstPage = [
    {
      id: 1,
      namaAnak: 'Aruna Putri',
      wali: 'Nadia Putri',
      kehadiran: '08.20',
      pelayanan: 'Penimbangan',
    },
    {
      id: 2,
      namaAnak: 'Bima Pratama',
      wali: 'Dewi Pratama',
      kehadiran: '08.25',
      pelayanan: 'Penimbangan',
    },
    {
      id: 3,
      namaAnak: 'Naila Safira',
      wali: 'Rina Safira',
      kehadiran: '08.35',
      pelayanan: 'Penimbangan',
    },
    {
      id: 4,
      namaAnak: 'Raka Aditya',
      wali: 'Doni Aditya',
      kehadiran: '08.35',
      pelayanan: 'Penimbangan',
    },
    ...Array.from({ length: 6 }, (_, idx) => ({
      id: idx + 5,
      namaAnak: 'Naila Safira',
      wali: 'Rina Safira',
      kehadiran: '08.35',
      pelayanan: 'Penimbangan',
    })),
  ];

  const extraSamples = [
    { namaAnak: 'Kayla Azzahra', wali: 'Dina Amelia', kehadiran: '08.40' },
    { namaAnak: 'Kenzo Alfarizi', wali: 'Rina Marlina', kehadiran: '08.45' },
    { namaAnak: 'Alesha Zahra', wali: 'Nisa Kurnia', kehadiran: '08.50' },
    { namaAnak: 'Zayn Malik', wali: 'Ayu Lestari', kehadiran: '08.55' },
    { namaAnak: 'Alvaro Putra', wali: 'Mega Putri', kehadiran: '09.05' },
  ];

  const extraRows = Array.from({ length: 76 }, (_, idx) => {
    const sample = extraSamples[idx % extraSamples.length];
    return {
      id: idx + 11,
      namaAnak: sample.namaAnak,
      wali: sample.wali,
      kehadiran: sample.kehadiran,
      pelayanan: idx % 3 === 0 ? 'Imunisasi' : 'Penimbangan',
    };
  });

  return [...firstPage, ...extraRows];
})();

const TANGGAL_OPTIONS = ['10', '12', '16', '20'];
const BULAN_OPTIONS = ['Oktober', 'November', 'Desember'];
const TAHUN_OPTIONS = ['2026', '2025'];

const ITEMS_PER_PAGE = 10;

const HasilKunjungan = () => {
  const [selectedTanggal, setSelectedTanggal] = useState('10');
  const [selectedBulan, setSelectedBulan] = useState('November');
  const [selectedTahun, setSelectedTahun] = useState('2026');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalTerdaftar = 128;
  const totalHadir = INITIAL_KEHADIRAN_LIST.length; // 86
  const totalTidakHadir = totalTerdaftar - totalHadir; // 42

  const totalPages = Math.max(
    1,
    Math.ceil(INITIAL_KEHADIRAN_LIST.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return INITIAL_KEHADIRAN_LIST.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [safeCurrentPage]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }

    if (safeCurrentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', safeCurrentPage, '...', totalPages];
  }, [safeCurrentPage, totalPages]);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

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
            href="/kader/jadwal-kegiatan"
            className="hover:text-[#2E5780] transition-colors"
          >
            Jadwal kegiatan
          </Link>
          <span>/</span>
          <span className="text-[#1D3B58] font-semibold">Kunjungan</span>
        </nav>

        <div className="mt-3">
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
            Hasil Kunjungan
          </h1>
          <p className="mt-1 text-[14px] text-[#475569]">
            Pantau kunjungan hari ini
          </p>
        </div>

        {/* 3 Filter Tanggal Kapsul */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('tanggal')}
              className="min-w-[82px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-4 py-1.5 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <span>{selectedTanggal}</span>
              <ChevronDown
                className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                  openDropdown === 'tanggal' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'tanggal' && (
              <div className="absolute left-0 mt-1.5 w-24 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                {TANGGAL_OPTIONS.map((tgl) => (
                  <button
                    key={tgl}
                    type="button"
                    onClick={() => {
                      setSelectedTanggal(tgl);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${
                      selectedTanggal === tgl
                        ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                        : 'text-[#475569] hover:bg-slate-50'
                    }`}
                  >
                    {tgl}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('bulan')}
              className="min-w-[148px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-1.5 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 transition-colors cursor-pointer"
            >
              <span>{selectedBulan}</span>
              <ChevronDown
                className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                  openDropdown === 'bulan' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'bulan' && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                {BULAN_OPTIONS.map((bulan) => (
                  <button
                    key={bulan}
                    type="button"
                    onClick={() => {
                      setSelectedBulan(bulan);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${
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

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('tahun')}
              className="min-w-[112px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-1.5 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 transition-colors cursor-pointer"
            >
              <span>{selectedTahun}</span>
              <ChevronDown
                className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                  openDropdown === 'tahun' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'tahun' && (
              <div className="absolute left-0 mt-1.5 w-32 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                {TAHUN_OPTIONS.map((tahun) => (
                  <button
                    key={tahun}
                    type="button"
                    onClick={() => {
                      setSelectedTahun(tahun);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${
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

        {/* 3 Kartu Statistik Kehadiran */}
        <section className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {totalTerdaftar}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Total balita terdaftar
            </p>
          </div>

          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {totalHadir}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Hadir
            </p>
          </div>

          <div className="bg-[#F3831E] rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(243,131,30,0.22)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {totalTidakHadir}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Tidak hadir
            </p>
          </div>
        </section>

        {/* Tabel Daftar Kehadiran */}
        <section className="mt-6 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-4">
            Daftar Kehadiran
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                  <th className="py-3 px-4 rounded-l-[10px]">Nama Anak</th>
                  <th className="py-3 px-4 text-center">Wali</th>
                  <th className="py-3 px-4 text-center">Kehadiran</th>
                  <th className="py-3 px-4 text-center rounded-r-[10px]">
                    Pelayanan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {row.namaAnak}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {row.wali}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {row.kehadiran}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {row.pelayanan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13.5px] font-semibold text-[#1E293B]">
            <p>
              Menampilkan {paginatedData.length} dari {totalHadir} data
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded-full text-[#1E293B] hover:bg-slate-100 disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
                aria-label="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {pageNumbers.map((page, idx) =>
                page === '...' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1.5 text-[#1E293B] select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-full text-[13px] flex items-center justify-center transition-colors cursor-pointer ${
                      safeCurrentPage === page
                        ? 'bg-[#2E5780] text-white font-bold shadow-xs'
                        : 'text-[#1E293B] font-semibold hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded-full text-[#1E293B] hover:bg-slate-100 disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
                aria-label="Halaman Berikutnya"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HasilKunjungan;