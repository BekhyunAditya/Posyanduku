import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import SidebarKader from '../../Components/layout/SidebarKader';

export const BALITA_STORAGE_KEY = 'posyanduku_kader_balita_binaan';

const INITIAL_DATA_BALITA = (() => {
  const firstPage = [
    {
      id: 1,
      nama: 'Aruna Putri',
      usiaBulan: 18,
      usiaText: '18 bulan',
      jenisKelamin: 'Perempuan',
      wali: 'Nadia Putri',
      kunjunganTerakhir: '10 Nov 2026',
    },
    {
      id: 2,
      nama: 'Bima Pratama',
      usiaBulan: 24,
      usiaText: '24 bulan',
      jenisKelamin: 'Laki-laki',
      wali: 'Dewi Pratama',
      kunjunganTerakhir: '10 Sep 2026',
    },
    {
      id: 3,
      nama: 'Naila Safira',
      usiaBulan: 12,
      usiaText: '12 bulan',
      jenisKelamin: 'Perempuan',
      wali: 'Rizal Safira',
      kunjunganTerakhir: '10 Nov 2026',
    },
    {
      id: 4,
      nama: 'Rafka Aditya',
      usiaBulan: 15,
      usiaText: '15 bulan',
      jenisKelamin: 'Laki-laki',
      wali: 'Doni Aditya',
      kunjunganTerakhir: '10 Nov 2026',
    },
    {
      id: 5,
      nama: 'Kayla Azzahra',
      usiaBulan: 9,
      usiaText: '9 bulan',
      jenisKelamin: 'Perempuan',
      wali: 'Dina Amelia',
      kunjunganTerakhir: '09 Nov 2026',
    },
    {
      id: 6,
      nama: 'Kenzo Alfarizi',
      usiaBulan: 30,
      usiaText: '30 bulan',
      jenisKelamin: 'Laki-laki',
      wali: 'Rina Marlina',
      kunjunganTerakhir: '09 Nov 2026',
    },
    {
      id: 7,
      nama: 'Alesha Zahra',
      usiaBulan: 20,
      usiaText: '20 bulan',
      jenisKelamin: 'Perempuan',
      wali: 'Nisa Kurnia',
      kunjunganTerakhir: '08 Nov 2026',
    },
    {
      id: 8,
      nama: 'Zayn Malik',
      usiaBulan: 14,
      usiaText: '14 bulan',
      jenisKelamin: 'Laki-laki',
      wali: 'Ayu Lestari',
      kunjunganTerakhir: '08 Nov 2026',
    },
  ];

  // Susun total 128 balita (62 Laki-laki & 66 Perempuan)
  const extraRows = Array.from({ length: 120 }, (_, idx) => {
    const isLaki = idx < 58;
    const usiaBulan = ((idx * 3) % 54) + 6;
    return {
      id: idx + 9,
      nama: isLaki ? `Alvaro Putra ${idx + 1}` : `Sabrina Putri ${idx + 1}`,
      usiaBulan,
      usiaText: `${usiaBulan} bulan`,
      jenisKelamin: isLaki ? 'Laki-laki' : 'Perempuan',
      wali: isLaki ? 'Mega Putri' : 'Sari Indah',
      kunjunganTerakhir: '10 Okt 2026',
    };
  });

  return [...firstPage, ...extraRows];
})();

const USIA_OPTIONS = [
  'Semua usia',
  '0 - 12 bulan',
  '13 - 24 bulan',
  '25 - 60 bulan',
];

const GENDER_OPTIONS = ['Jenis kelamin', 'Laki-laki', 'Perempuan'];

const ITEMS_PER_PAGE = 8;

const toSlug = (nama) =>
  nama
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

const DataBalita = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsia, setSelectedUsia] = useState('Semua usia');
  const [selectedGender, setSelectedGender] = useState('Jenis kelamin');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allBalita = useMemo(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(BALITA_STORAGE_KEY) || '[]'
      );
      if (Array.isArray(saved) && saved.length > 0) {
        return [...saved, ...INITIAL_DATA_BALITA];
      }
    } catch {
      // Gunakan data default jika localStorage tidak tersedia
    }
    return INITIAL_DATA_BALITA;
  }, []);

  const totalBalita = allBalita.length;
  const totalLaki = useMemo(
    () => allBalita.filter((b) => b.jenisKelamin === 'Laki-laki').length,
    [allBalita]
  );
  const totalPerempuan = useMemo(
    () => allBalita.filter((b) => b.jenisKelamin === 'Perempuan').length,
    [allBalita]
  );

  const filteredData = useMemo(() => {
    return allBalita.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.wali.toLowerCase().includes(searchQuery.toLowerCase());

      let matchUsia = true;
      if (selectedUsia === '0 - 12 bulan') {
        matchUsia = item.usiaBulan <= 12;
      } else if (selectedUsia === '13 - 24 bulan') {
        matchUsia = item.usiaBulan >= 13 && item.usiaBulan <= 24;
      } else if (selectedUsia === '25 - 60 bulan') {
        matchUsia = item.usiaBulan >= 25;
      }

      const matchGender =
        selectedGender === 'Jenis kelamin' ||
        item.jenisKelamin === selectedGender;

      return matchSearch && matchUsia && matchGender;
    });
  }, [allBalita, searchQuery, selectedUsia, selectedGender]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, safeCurrentPage]);

  const startItem =
    filteredData.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredData.length
  );

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

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      <SidebarKader />

      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <p className="text-[12.5px] font-medium text-[#334155]">
          Kader/Data balita
        </p>

        {/* Header Halaman & Tombol Tambah Balita */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
            Data balita binaan
          </h1>

          <Link
            href="/kader/data-balita/tambah"
            className="bg-[#2E5780] hover:bg-[#234466] text-white text-[14px] font-bold px-7 py-2.5 rounded-full shadow-xs transition-colors duration-200"
          >
            Tambah Balita
          </Link>
        </div>

        {/* 3 Kartu Statistik */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-[#B5D5F0] rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {totalBalita}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Total balita terdaftar
            </p>
          </div>

          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {totalLaki}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Laki-laki
            </p>
          </div>

          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {totalPerempuan}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Perempuan
            </p>
          </div>
        </section>

        {/* Baris Pencarian & Filter */}
        <div className="mt-5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama anak...."
              className="w-full bg-white border border-slate-300/80 focus:border-[#2E5780] focus:outline-none rounded-full pl-5 pr-11 py-2.5 text-[14px] text-[#1E293B] placeholder:text-slate-400 transition-colors"
            />
            <Search className="w-5 h-5 text-[#475569] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Usia */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'usia' ? null : 'usia'))
                }
                className="min-w-[168px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <span>{selectedUsia}</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                    openDropdown === 'usia' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'usia' && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                  {USIA_OPTIONS.map((usia) => (
                    <button
                      key={usia}
                      type="button"
                      onClick={() => {
                        setSelectedUsia(usia);
                        setCurrentPage(1);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                        selectedUsia === usia
                          ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                          : 'text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      {usia}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Jenis Kelamin */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === 'gender' ? null : 'gender'
                  )
                }
                className="min-w-[168px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <span>{selectedGender}</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                    openDropdown === 'gender' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'gender' && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                  {GENDER_OPTIONS.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => {
                        setSelectedGender(gender);
                        setCurrentPage(1);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                        selectedGender === gender
                          ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                          : 'text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kartu Tabel Daftar Balita */}
        <section className="mt-5 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                  <th className="py-3 px-4 rounded-l-[10px]">Nama Anak</th>
                  <th className="py-3 px-4 text-center">Usia</th>
                  <th className="py-3 px-4 text-center">Jenis Kelamin</th>
                  <th className="py-3 px-4 text-center">Wali</th>
                  <th className="py-3 px-4 text-center rounded-r-[10px]">
                    Kunjungan Terakhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() =>
                        router.visit(`/kader/data-balita/${toSlug(row.nama)}`)
                      }
                      className="hover:bg-[#E3EEF8]/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#1D3B58] whitespace-nowrap">
                        {row.nama}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {row.usiaText}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {row.jenisKelamin}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {row.wali}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {row.kunjunganTerakhir}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      Data balita tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Paginasi */}
          <div className="mt-5 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13.5px] font-semibold text-[#1E293B]">
            <p>
              Menampilkan {startItem}–{endItem} dari {filteredData.length}{' '}
              balita
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

export default DataBalita;