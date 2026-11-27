import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarKader from '@/Components/layout/SidebarKader';

// 8 data awal halaman 1 sesuai tampilan Figma + 120 data lanjutan (total 128: 62 Laki-laki, 66 Perempuan)
const INITIAL_BALITA_DATA = (() => {
  const pageOneRows = [
    {
      id: 1,
      nama: 'Aruna Putri',
      tanggalLahir: '12 Apr 2024',
      usiaBulan: 18,
      jenisKelamin: 'Perempuan',
      orangTua: 'Nadia Putri',
      status: 'Normal',
    },
    {
      id: 2,
      nama: 'Bima Pratama',
      tanggalLahir: '24 Mei 2024',
      usiaBulan: 24,
      jenisKelamin: 'Laki-laki',
      orangTua: 'Dewi Pratama',
      status: 'Perlu dipantau',
    },
    ...Array.from({ length: 6 }, (_, idx) => ({
      id: idx + 3,
      nama: 'Naila Safira',
      tanggalLahir: '15 Juni 2024',
      usiaBulan: 12,
      jenisKelamin: 'Perempuan',
      orangTua: 'Rizal Safira',
      status: 'Normal',
    })),
  ];

  const sampleBoys = [
    { nama: 'Rafka Aditya', orangTua: 'Sinta Wijaya', tgl: '08 Jan 2025', usia: 10 },
    { nama: 'Kenzo Alfarizi', orangTua: 'Rina Marlina', tgl: '19 Mar 2024', usia: 20 },
    { nama: 'Zayn Malik', orangTua: 'Ayu Lestari', tgl: '03 Agu 2024', usia: 15 },
    { nama: 'Alvaro Putra', orangTua: 'Mega Putri', tgl: '14 Nov 2023', usia: 24 },
    { nama: 'Gibran Ramadhan', orangTua: 'Fitri Handayani', tgl: '27 Feb 2025', usia: 9 },
  ];

  const sampleGirls = [
    { nama: 'Kayla Azzahra', orangTua: 'Dina Amelia', tgl: '11 Jul 2024', usia: 16 },
    { nama: 'Alesha Zahra', orangTua: 'Nisa Kurnia', tgl: '22 Sep 2024', usia: 14 },
    { nama: 'Mikayla Putri', orangTua: 'Ratna Sari', tgl: '05 Des 2023', usia: 23 },
    { nama: 'Shaqueena', orangTua: 'Lia Oktaviani', tgl: '17 Apr 2025', usia: 7 },
    { nama: 'Qiana Humaira', orangTua: 'Maya Anggraini', tgl: '29 Okt 2024', usia: 13 },
  ];

  // Sisa 120 data: 61 Laki-laki + 59 Perempuan agar total tepat 128 (62 L, 66 P)
  const extraRows = [];
  for (let i = 0; i < 61; i++) {
    const template = sampleBoys[i % sampleBoys.length];
    extraRows.push({
      id: 9 + i,
      nama: template.nama,
      tanggalLahir: template.tgl,
      usiaBulan: template.usia,
      jenisKelamin: 'Laki-laki',
      orangTua: template.orangTua,
      status: i % 11 === 0 ? 'Perlu dipantau' : 'Normal',
    });
  }

  for (let i = 0; i < 59; i++) {
    const template = sampleGirls[i % sampleGirls.length];
    extraRows.push({
      id: 70 + i,
      nama: template.nama,
      tanggalLahir: template.tgl,
      usiaBulan: template.usia,
      jenisKelamin: 'Perempuan',
      orangTua: template.orangTua,
      status: i % 13 === 0 ? 'Perlu dipantau' : 'Normal',
    });
  }

  return [...pageOneRows, ...extraRows];
})();

const USIA_OPTIONS = [
  { label: 'Semua usia', value: 'all' },
  { label: '0 - 12 bulan', value: '0-12' },
  { label: '13 - 24 bulan', value: '13-24' },
  { label: '> 24 bulan', value: '25+' },
];

const GENDER_OPTIONS = [
  { label: 'Jenis kelamin', value: 'all' },
  { label: 'Laki-laki', value: 'Laki-laki' },
  { label: 'Perempuan', value: 'Perempuan' },
];

const ITEMS_PER_PAGE = 8;

const DataBalita = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsia, setSelectedUsia] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [usiaDropdownOpen, setUsiaDropdownOpen] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Hitung statistik total dari dataset
  const stats = useMemo(() => {
    const total = INITIAL_BALITA_DATA.length;
    const lakiLaki = INITIAL_BALITA_DATA.filter(
      (item) => item.jenisKelamin === 'Laki-laki'
    ).length;
    const perempuan = INITIAL_BALITA_DATA.filter(
      (item) => item.jenisKelamin === 'Perempuan'
    ).length;

    return { total, lakiLaki, perempuan };
  }, []);

  // Filter data berdasarkan pencarian, usia, dan jenis kelamin
  const filteredData = useMemo(() => {
    return INITIAL_BALITA_DATA.filter((item) => {
      const matchesName = item.nama
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      const matchesGender =
        selectedGender === 'all' || item.jenisKelamin === selectedGender;

      let matchesUsia = true;
      if (selectedUsia === '0-12') {
        matchesUsia = item.usiaBulan <= 12;
      } else if (selectedUsia === '13-24') {
        matchesUsia = item.usiaBulan >= 13 && item.usiaBulan <= 24;
      } else if (selectedUsia === '25+') {
        matchesUsia = item.usiaBulan > 24;
      }

      return matchesName && matchesGender && matchesUsia;
    });
  }, [searchQuery, selectedUsia, selectedGender]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, safeCurrentPage]);

  const startItem =
    filteredData.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredData.length
  );

  // Susun tombol nomor halaman (1, 2, 3, ..., 16)
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

  const activeUsiaLabel =
    USIA_OPTIONS.find((opt) => opt.value === selectedUsia)?.label ||
    'Semua usia';
  const activeGenderLabel =
    GENDER_OPTIONS.find((opt) => opt.value === selectedGender)?.label ||
    'Jenis kelamin';

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      {/* Sidebar Kiri */}
      <SidebarKader />

      {/* Konten Utama Kanan */}
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <p className="text-[12.5px] font-medium text-[#334155]">
          Kader/Data balita
        </p>

        {/* Judul Halaman */}
        <h1 className="mt-3 text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
          Data balita binaan
        </h1>

        {/* 3 Kartu Ringkasan */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Kartu Total Balita */}
          <div className="bg-[#B5D5F0] rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {stats.total}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Total balita terdaftar
            </p>
          </div>

          {/* Kartu Laki-laki */}
          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {stats.lakiLaki}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Laki-laki
            </p>
          </div>

          {/* Kartu Perempuan */}
          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col justify-center min-h-[116px]">
            <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
              {stats.perempuan}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-[#1D3B58]">
              Perempuan
            </p>
          </div>
        </section>

        {/* Baris Pencarian & Filter */}
        <section className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
          {/* Input Pencarian */}
          <div className="relative flex-1 max-w-[360px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama anak...."
              className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-full pl-5 pr-11 py-2.5 text-[14px] text-[#1E293B] placeholder:text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors"
            />
            <Search className="w-5 h-5 text-[#334155] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown Filter Usia */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setUsiaDropdownOpen((prev) => !prev);
                setGenderDropdownOpen(false);
              }}
              className="w-full sm:w-auto min-w-[165px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors cursor-pointer"
            >
              <span>{activeUsiaLabel}</span>
              <ChevronDown
                className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                  usiaDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {usiaDropdownOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-[18px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-30">
                {USIA_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedUsia(option.value);
                      setUsiaDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                      selectedUsia === option.value
                        ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                        : 'text-[#475569] hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Filter Jenis Kelamin */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setGenderDropdownOpen((prev) => !prev);
                setUsiaDropdownOpen(false);
              }}
              className="w-full sm:w-auto min-w-[175px] bg-white border border-slate-300/90 hover:border-[#2E5780]/60 rounded-full px-5 py-2.5 text-[14px] font-semibold text-[#1E293B] inline-flex items-center justify-between gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors cursor-pointer"
            >
              <span>{activeGenderLabel}</span>
              <ChevronDown
                className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
                  genderDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {genderDropdownOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-[18px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-30">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedGender(option.value);
                      setGenderDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                      selectedGender === option.value
                        ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                        : 'text-[#475569] hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Kartu Tabel Daftar Balita */}
        <section className="mt-6 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-4">
            Daftar Balita
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                  <th className="py-3 px-4 rounded-l-[10px]">Nama Anak</th>
                  <th className="py-3 px-4 text-center">Tanggal Lahir</th>
                  <th className="py-3 px-4 text-center">Usia</th>
                  <th className="py-3 px-4 text-center">Jenis Kelamin</th>
                  <th className="py-3 px-4 text-center">Orang tua</th>
                  <th className="py-3 px-4 text-center rounded-r-[10px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/90 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-medium">{row.nama}</td>
                      <td className="py-3.5 px-4 text-center">
                        {row.tanggalLahir}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.usiaBulan} bulan
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.jenisKelamin}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.orangTua}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block leading-tight ${
                            row.status === 'Perlu dipantau'
                              ? 'max-w-[78px] font-medium text-[#1E293B]'
                              : 'text-[#1E293B]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      Data balita tidak ditemukan sesuai filter yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Paginasi */}
          <div className="mt-5 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13.5px] font-semibold text-[#1E293B]">
            <p>
              Menampilkan {startItem}–{endItem} dari {filteredData.length} balita
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

              {pageNumbers.map((page, index) =>
                page === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
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