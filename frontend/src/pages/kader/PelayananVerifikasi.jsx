import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import SidebarKader from '../../components/layout/SidebarKader';

const STORAGE_KEY = 'posyanduku_kader_pelayanan';

const JENIS_PELAYANAN_OPTIONS = [
  'Imunisasi',
  'Pemeriksaan',
  'Pemberian Vitamin A',
  'Konseling Gizi',
];

const DAFTAR_ANAK_SUGGESTIONS = [
  'Aruna Putri',
  'Bima Pratama',
  'Naila Safira',
  'Rafka Aditya',
  'Kayla Azzahra',
];

// 130 riwayat awal (8 data halaman pertama + 122 data lanjutan)
const INITIAL_RIWAYAT_PELAYANAN = (() => {
  const firstPageRows = [
    {
      id: 1,
      namaAnak: 'Aruna Putri',
      jenisLayanan: 'Imunisasi',
      tanggal: '10 Nov 2026',
      status: 'Menunggu verifikasi',
      verifikator: 'Belum ditetapkan',
      catatan: 'Imunisasi lanjutan DPT-HB-Hib',
    },
    {
      id: 2,
      namaAnak: 'Bima Pratama',
      jenisLayanan: 'Imunisasi',
      tanggal: '10 Nov 2026',
      status: 'Perlu diperiksa',
      verifikator: 'Bidan Rina',
      catatan: 'Perlu evaluasi suhu tubuh sebelum imunisasi',
    },
    {
      id: 3,
      namaAnak: 'Naila Safira',
      jenisLayanan: 'Pemeriksaan',
      tanggal: '10 Nov 2026',
      status: 'Terverifikasi',
      verifikator: 'Bidan Rina',
      catatan: 'Pemeriksaan tumbuh kembang rutin',
    },
    {
      id: 4,
      namaAnak: 'Naila Safira',
      jenisLayanan: 'Pemeriksaan',
      tanggal: '10 Nov 2026',
      status: 'Terverifikasi',
      verifikator: 'Bidan Rina',
      catatan: 'Pemeriksaan fisik dan KMS',
    },
    {
      id: 5,
      namaAnak: 'Rafka Aditya',
      jenisLayanan: 'Pemeriksaan',
      tanggal: '10 Nov 2026',
      status: 'Terverifikasi',
      verifikator: 'Bidan Rina',
      catatan: 'Kondisi sehat, sesuai grafik KMS',
    },
    {
      id: 6,
      namaAnak: 'Kayla Azzahra',
      jenisLayanan: 'Imunisasi',
      tanggal: '09 Nov 2026',
      status: 'Terverifikasi',
      verifikator: 'Bidan Rina',
      catatan: 'Imunisasi campak rubella',
    },
    {
      id: 7,
      namaAnak: 'Kenzo Alfarizi',
      jenisLayanan: 'Pemberian Vitamin A',
      tanggal: '09 Nov 2026',
      status: 'Terverifikasi',
      verifikator: 'Bidan Rina',
      catatan: 'Kapsul vitamin A merah',
    },
    {
      id: 8,
      namaAnak: 'Alesha Zahra',
      jenisLayanan: 'Pemeriksaan',
      tanggal: '08 Nov 2026',
      status: 'Terverifikasi',
      verifikator: 'Bidan Rina',
      catatan: 'Pemantauan rutin bulanan',
    },
  ];

  const extraNames = [
    'Aruna Putri',
    'Bima Pratama',
    'Naila Safira',
    'Rafka Aditya',
    'Kayla Azzahra',
    'Kenzo Alfarizi',
    'Alesha Zahra',
    'Zayn Malik',
  ];

  const extraRows = Array.from({ length: 122 }, (_, idx) => ({
    id: idx + 9,
    namaAnak: extraNames[idx % extraNames.length],
    jenisLayanan: idx % 2 === 0 ? 'Pemeriksaan' : 'Imunisasi',
    tanggal: '10 Okt 2026',
    status: 'Terverifikasi',
    verifikator: 'Bidan Rina',
    catatan: 'Pelayanan posyandu rutin bulan Oktober',
  }));

  return [...firstPageRows, ...extraRows];
})();

const ITEMS_PER_PAGE = 8;

const formatShortDate = (dateText) => {
  const monthMap = {
    Januari: 'Jan',
    Februari: 'Feb',
    Maret: 'Mar',
    April: 'Apr',
    Mei: 'Mei',
    Juni: 'Jun',
    Juli: 'Jul',
    Agustus: 'Agu',
    September: 'Sep',
    Oktober: 'Okt',
    November: 'Nov',
    Desember: 'Des',
  };

  return dateText.replace(
    /\b(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\b/g,
    (match) => monthMap[match] || match
  );
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Menunggu verifikasi':
      return 'bg-[#D6E8F8] text-[#1D3B58]';
    case 'Perlu diperiksa':
      return 'bg-[#F6D7BC] text-[#1E293B]';
    case 'Terverifikasi':
      return 'bg-[#D7F7CC] text-[#1E293B]';
    default:
      return 'bg-slate-100 text-[#1E293B]';
  }
};

const PelayananVerifikasi = () => {
  const [riwayatList, setRiwayatList] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        return [...saved, ...INITIAL_RIWAYAT_PELAYANAN];
      }
    } catch {
      // Gunakan data default jika localStorage tidak tersedia
    }
    return INITIAL_RIWAYAT_PELAYANAN;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [jenisDropdownOpen, setJenisDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    tanggal: '10 November 2026',
    jenisPelayanan: 'Imunisasi',
    namaAnak: 'Aruna Putri',
    catatan: '',
  });

  const totalPages = Math.max(1, Math.ceil(riwayatList.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return riwayatList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [riwayatList, safeCurrentPage]);

  const startItem =
    riwayatList.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(safeCurrentPage * ITEMS_PER_PAGE, riwayatList.length);

  // Susun nomor halaman paginasi (1, 2, 3, ..., 17)
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

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.tanggal.trim() || !formData.namaAnak.trim()) {
      setErrorMsg('Mohon lengkapi tanggal dan nama anak terlebih dahulu.');
      return;
    }

    const newRecord = {
      id: Date.now(),
      namaAnak: formData.namaAnak.trim(),
      jenisLayanan: formData.jenisPelayanan,
      tanggal: formatShortDate(formData.tanggal.trim()),
      status: 'Menunggu verifikasi',
      verifikator: 'Belum ditetapkan',
      catatan: formData.catatan.trim() || 'Diajukan kader posyandu',
    };

    try {
      const existingSaved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newRecord, ...existingSaved])
      );
    } catch {
      // Abaikan jika penyimpanan lokal dibatasi
    }

    setRiwayatList((prev) => [newRecord, ...prev]);
    setCurrentPage(1);
    setFormData((prev) => ({ ...prev, catatan: '' }));
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      {/* Sidebar Kiri (Menu "Pelayanan" aktif) */}
      <SidebarKader />

      {/* Konten Utama Kanan */}
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <p className="text-[12.5px] font-medium text-[#334155]">
          Kader/Pelayanan
        </p>

        {!isSubmitted ? (
          <>
            {/* Judul Halaman */}
            <h1 className="mt-3 text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
              Catatan pelayanan
            </h1>

            {/* ================= KARTU 1: RIWAYAT PELAYANAN ================= */}
            <section className="mt-6 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-4">
                Riwayat pelayanan
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                      <th className="py-3 px-4 rounded-l-[10px]">Nama Anak</th>
                      <th className="py-3 px-4 text-center">Jenis layanan</th>
                      <th className="py-3 px-4 text-center">Tanggal</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center rounded-r-[10px]">
                        Verifikator
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                    {paginatedData.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/90 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                          {row.namaAnak}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {row.jenisLayanan}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {row.tanggal}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-block min-w-[148px] px-3.5 py-1 rounded-full text-[12.5px] font-medium ${getStatusBadgeStyle(
                              row.status
                            )}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {row.verifikator}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Paginasi */}
              <div className="mt-5 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13.5px] font-semibold text-[#1E293B]">
                <p>
                  Menampilkan {startItem}–{endItem} dari {riwayatList.length}{' '}
                  riwayat
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
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

            {/* ================= KARTU 2: TAMBAH CATATAN PELAYANAN ================= */}
            <section className="mt-6 bg-white rounded-[24px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-5">
                Tambah catatan pelayanan
              </h2>

              {errorMsg && (
                <div className="mb-4 rounded-[14px] bg-orange-50 border border-[#F3831E]/40 px-4 py-3 text-[13.5px] font-medium text-[#9A3412]">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Baris 1: Tanggal & Jenis Pelayanan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Input Tanggal */}
                  <div>
                    <label
                      htmlFor="tanggalPelayanan"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Tanggal
                    </label>
                    <div className="relative">
                      <input
                        id="tanggalPelayanan"
                        type="text"
                        value={formData.tanggal}
                        onChange={(e) =>
                          handleFieldChange('tanggal', e.target.value)
                        }
                        placeholder="10 November 2026"
                        className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] pl-4 pr-11 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                      />
                      <Calendar className="w-5 h-5 text-[#475569] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Dropdown Jenis Pelayanan */}
                  <div className="relative">
                    <label className="block text-[13.5px] font-bold text-[#1D3B58] mb-2">
                      Jenis pelayanan
                    </label>
                    <button
                      type="button"
                      onClick={() => setJenisDropdownOpen((prev) => !prev)}
                      className="w-full bg-white border border-slate-300/90 hover:border-[#2E5780]/70 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{formData.jenisPelayanan}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#1D3B58] stroke-[2.2] transition-transform duration-200 ${
                          jenisDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {jenisDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                        {JENIS_PELAYANAN_OPTIONS.map((jenis) => (
                          <button
                            key={jenis}
                            type="button"
                            onClick={() => {
                              handleFieldChange('jenisPelayanan', jenis);
                              setJenisDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                              formData.jenisPelayanan === jenis
                                ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                                : 'text-[#475569] hover:bg-slate-50'
                            }`}
                          >
                            {jenis}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Baris 2: Nama Anak */}
                <div>
                  <label
                    htmlFor="namaAnakPelayanan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Nama anak
                  </label>
                  <input
                    id="namaAnakPelayanan"
                    list="anak-pelayanan-options"
                    type="text"
                    value={formData.namaAnak}
                    onChange={(e) =>
                      handleFieldChange('namaAnak', e.target.value)
                    }
                    placeholder="Masukkan nama anak"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                  <datalist id="anak-pelayanan-options">
                    {DAFTAR_ANAK_SUGGESTIONS.map((nama) => (
                      <option key={nama} value={nama} />
                    ))}
                  </datalist>
                </div>

                {/* Baris 3: Catatan */}
                <div>
                  <label
                    htmlFor="catatanPelayanan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Catatan
                  </label>
                  <input
                    id="catatanPelayanan"
                    type="text"
                    value={formData.catatan}
                    onChange={(e) =>
                      handleFieldChange('catatan', e.target.value)
                    }
                    placeholder="Tambahkan catatan di sini..."
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14px] text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* Tombol Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    Simpan &amp; ajukan verifikasi
                  </button>
                </div>
              </form>
            </section>
          </>
        ) : (
          /* ================= STATE KONFIRMASI BERHASIL DIAJUKAN ================= */
          <div className="mt-3">
            <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
              Catatan diajukan untuk verifikasi.
            </h1>

            {/* Banner Status Biru Muda */}
            <div className="mt-5 bg-[#B5D5F0] rounded-[16px] px-6 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[#1D3B58]">
              <p className="text-[13.5px] font-bold">Status:</p>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed">
                Menunggu pemeriksaan tenaga kesehatan.
              </p>
            </div>

            {/* Tombol Kembali ke Pelayanan */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <span>Kembali ke Pelayanan</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PelayananVerifikasi;