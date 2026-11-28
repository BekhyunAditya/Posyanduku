import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';
import SidebarKader from '../../Components/layout/SidebarKader';
import { JADWAL_STORAGE_KEY } from './JadwalKegiatan';

const parseIndoDate = (dateStr) => {
  const monthMap = {
    Januari: { short: 'Jan', full: 'Januari' },
    Februari: { short: 'Feb', full: 'Februari' },
    Maret: { short: 'Mar', full: 'Maret' },
    April: { short: 'Apr', full: 'April' },
    Mei: { short: 'Mei', full: 'Mei' },
    Juni: { short: 'Jun', full: 'Juni' },
    Juli: { short: 'Jul', full: 'Juli' },
    Agustus: { short: 'Agu', full: 'Agustus' },
    September: { short: 'Sep', full: 'September' },
    Oktober: { short: 'Okt', full: 'Oktober' },
    November: { short: 'Nov', full: 'November' },
    Desember: { short: 'Des', full: 'Desember' },
  };

  let bulan = 'November';
  let shortDate = dateStr;

  Object.entries(monthMap).forEach(([fullName, info]) => {
    if (dateStr.includes(fullName)) {
      bulan = info.full;
      shortDate = dateStr.replace(fullName, info.short);
    }
  });

  const yearMatch = dateStr.match(/\b(20\d{2})\b/);
  const tahun = yearMatch ? yearMatch[1] : '2026';

  return { shortDate, bulan, tahun };
};

const TambahKegiatan = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    namaKegiatan: 'Penimbangan & pelayanan balita',
    tanggal: '20 November 2026',
    waktu: '08.00 - 11.00',
    lokasi: 'Posyandu Melati 01, Balai RW.03',
    sasaran: 'Orang tua balita',
    catatanTambahan:
      'Orang tua perlu membawa buku KIA, kebutuhan anak, dan catatan konsultasi.',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.namaKegiatan.trim() ||
      !formData.tanggal.trim() ||
      !formData.waktu.trim() ||
      !formData.lokasi.trim()
    ) {
      setErrorMsg(
        'Mohon lengkapi nama kegiatan, tanggal, waktu, dan lokasi kegiatan.'
      );
      return;
    }

    const { shortDate, bulan, tahun } = parseIndoDate(formData.tanggal.trim());
    const cleanLokasi = formData.lokasi.split(',')[0].trim();

    const newJadwal = {
      id: Date.now(),
      kegiatan: formData.namaKegiatan.trim(),
      tanggal: shortDate,
      bulan,
      tahun,
      waktu: formData.waktu.trim(),
      lokasi: cleanLokasi || formData.lokasi.trim(),
      sasaran: formData.sasaran.trim(),
      catatanTambahan: formData.catatanTambahan.trim(),
      status: 'Terjadwal',
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(JADWAL_STORAGE_KEY) || '[]'
      );
      localStorage.setItem(
        JADWAL_STORAGE_KEY,
        JSON.stringify([newJadwal, ...existing])
      );
    } catch {
      // Abaikan jika penyimpanan lokal dibatasi
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {isSubmitted ? 'Jadwal Kegiatan' : 'Jadwal kegiatan'}
          </Link>
          <span>/</span>
          <span className="text-[#1D3B58] font-semibold">Tambah kegiatan</span>
        </nav>

        {!isSubmitted ? (
          <>
            <div className="mt-3">
              <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
                Tambah Kegiatan
              </h1>
              <p className="mt-1 text-[14px] text-[#475569]">
                Buat jadwal dan pantau kunjungan
              </p>
            </div>

            <section className="mt-6 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-5">
                Detail Kegiatan
              </h2>

              {errorMsg && (
                <div className="mb-5 rounded-[14px] bg-orange-50 border border-[#F3831E]/40 px-4 py-3 text-[13.5px] font-medium text-[#9A3412]">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="namaKegiatan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Nama Kegiatan
                  </label>
                  <input
                    id="namaKegiatan"
                    type="text"
                    value={formData.namaKegiatan}
                    onChange={(e) =>
                      handleChange('namaKegiatan', e.target.value)
                    }
                    placeholder="Masukkan nama kegiatan"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="tanggalKegiatan"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Tanggal
                    </label>
                    <div className="relative">
                      <input
                        id="tanggalKegiatan"
                        type="text"
                        value={formData.tanggal}
                        onChange={(e) =>
                          handleChange('tanggal', e.target.value)
                        }
                        placeholder="20 November 2026"
                        className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] pl-4 pr-11 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                      />
                      <Calendar className="w-5 h-5 text-[#475569] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="waktuKegiatan"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Waktu (WIB)
                    </label>
                    <input
                      id="waktuKegiatan"
                      type="text"
                      value={formData.waktu}
                      onChange={(e) => handleChange('waktu', e.target.value)}
                      placeholder="08.00 - 11.00"
                      className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lokasiKegiatan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Lokasi
                  </label>
                  <input
                    id="lokasiKegiatan"
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => handleChange('lokasi', e.target.value)}
                    placeholder="Posyandu Melati 01, Balai RW.03"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sasaranKegiatan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Sasaran
                  </label>
                  <input
                    id="sasaranKegiatan"
                    type="text"
                    value={formData.sasaran}
                    onChange={(e) => handleChange('sasaran', e.target.value)}
                    placeholder="Orang tua balita"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="catatanTambahan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Catatan tambahan
                  </label>
                  <input
                    id="catatanTambahan"
                    type="text"
                    value={formData.catatanTambahan}
                    onChange={(e) =>
                      handleChange('catatanTambahan', e.target.value)
                    }
                    placeholder="Tambahkan catatan persiapan untuk orang tua"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="w-full bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold py-3.5 px-6 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    Tambah kegiatan
                  </button>

                  <button
                    type="button"
                    onClick={() => router.visit('/kader/jadwal-kegiatan')}
                    className="w-full bg-white hover:bg-slate-50 text-[#1D3B58] text-[15px] font-bold py-3.5 px-6 rounded-full border border-[#2E5780]/70 transition-colors duration-200 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </section>
          </>
        ) : (
          <div className="mt-3">
            <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
              Kegiatan berhasil ditambahkan.
            </h1>
            <p className="mt-2 text-[14.5px] text-[#334155]">
              Jadwal akan tampil pada kalender keluarga yang terhubung.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.visit('/kader/jadwal-kegiatan')}
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <span>Lihat jadwal kegiatan</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TambahKegiatan;