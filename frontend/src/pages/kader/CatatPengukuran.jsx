import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SidebarKader from '../../components/layout/SidebarKader';

const METODE_OPTIONS = ['Berbaring', 'Berdiri'];

const DAFTAR_ANAK_SUGGESTIONS = [
  'Aruna Putri',
  'Bima Pratama',
  'Naila Safira',
];

const CatatPengukuran = () => {
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [metodeDropdownOpen, setMetodeDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    namaAnak: 'Aruna Putri',
    tanggalPengukuran: '10 November 2026',
    beratBadan: '10.3',
    tinggiBadan: '80.8',
    metodePengukuran: 'Berbaring',
    catatanKunjungan: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.namaAnak.trim() ||
      !formData.tanggalPengukuran.trim() ||
      !formData.beratBadan.trim() ||
      !formData.tinggiBadan.trim()
    ) {
      setErrorMsg('Mohon lengkapi nama anak, tanggal, berat badan, dan tinggi badan.');
      return;
    }

    // Simpan riwayat pengukuran baru ke localStorage untuk prototyping frontend
    try {
      const storageKey = 'posyanduku_kader_pengukuran';
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newRecord = {
        id: Date.now(),
        ...formData,
        petugas: 'Siti Rahmawati',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify([newRecord, ...existing]));
    } catch {
      // Abaikan jika akses localStorage dibatasi browser
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    navigate('/kader/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      {/* Sidebar Kiri (Menu "Pengukuran" aktif) */}
      <SidebarKader />

      {/* Konten Utama Kanan */}
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <p className="text-[12.5px] font-medium text-[#334155]">
          Kader/Pengukuran
        </p>

        {!isSubmitted ? (
          <>
            {/* Judul Halaman Form */}
            <h1 className="mt-3 text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
              Catat hasil Pengukuran
            </h1>

            {/* Kartu Putih Form Data Pengukuran */}
            <section className="mt-6 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-5">
                Data pengukuran
              </h2>

              {errorMsg && (
                <div className="mb-5 rounded-[14px] bg-orange-50 border border-[#F3831E]/40 px-4 py-3 text-[13.5px] font-medium text-[#9A3412]">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field: Anak */}
                <div>
                  <label
                    htmlFor="namaAnak"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Anak
                  </label>
                  <input
                    id="namaAnak"
                    list="daftar-balita-options"
                    type="text"
                    value={formData.namaAnak}
                    onChange={(e) => handleChange('namaAnak', e.target.value)}
                    placeholder="Masukkan nama anak"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                  <datalist id="daftar-balita-options">
                    {DAFTAR_ANAK_SUGGESTIONS.map((nama) => (
                      <option key={nama} value={nama} />
                    ))}
                  </datalist>
                </div>

                {/* Field: Tanggal pengukuran */}
                <div>
                  <label
                    htmlFor="tanggalPengukuran"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Tanggal pengukuran
                  </label>
                  <input
                    id="tanggalPengukuran"
                    type="text"
                    value={formData.tanggalPengukuran}
                    onChange={(e) =>
                      handleChange('tanggalPengukuran', e.target.value)
                    }
                    placeholder="Contoh: 10 November 2026"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* Grid 2 Kolom: Berat badan & Tinggi badan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="beratBadan"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Berat badan (kg)
                    </label>
                    <input
                      id="beratBadan"
                      type="text"
                      inputMode="decimal"
                      value={formData.beratBadan}
                      onChange={(e) =>
                        handleChange('beratBadan', e.target.value)
                      }
                      placeholder="Contoh: 10.3"
                      className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tinggiBadan"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Tinggi badan (cm)
                    </label>
                    <input
                      id="tinggiBadan"
                      type="text"
                      inputMode="decimal"
                      value={formData.tinggiBadan}
                      onChange={(e) =>
                        handleChange('tinggiBadan', e.target.value)
                      }
                      placeholder="Contoh: 80.8"
                      className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Field: Metode pengukuran */}
                <div className="relative">
                  <label className="block text-[13.5px] font-bold text-[#1D3B58] mb-2">
                    Metode pengukuran
                  </label>
                  <button
                    type="button"
                    onClick={() => setMetodeDropdownOpen((prev) => !prev)}
                    className="w-full bg-white border border-slate-300/90 hover:border-[#2E5780]/70 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{formData.metodePengukuran}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#1D3B58] stroke-[2.2] transition-transform duration-200 ${
                        metodeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {metodeDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                      {METODE_OPTIONS.map((metode) => (
                        <button
                          key={metode}
                          type="button"
                          onClick={() => {
                            handleChange('metodePengukuran', metode);
                            setMetodeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                            formData.metodePengukuran === metode
                              ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                              : 'text-[#475569] hover:bg-slate-50'
                          }`}
                        >
                          {metode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field: Catatan kunjungan */}
                <div>
                  <label
                    htmlFor="catatanKunjungan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Catatan kunjungan
                  </label>
                  <textarea
                    id="catatanKunjungan"
                    rows={4}
                    value={formData.catatanKunjungan}
                    onChange={(e) =>
                      handleChange('catatanKunjungan', e.target.value)
                    }
                    placeholder="Tuliskan catatan pengamatan...."
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14px] text-[#1E293B] placeholder:text-slate-400 resize-none transition-colors"
                  />
                </div>

                {/* Tombol Aksi Bawah */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="w-full bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold py-3.5 px-6 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    Simpan pengukuran
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full bg-white hover:bg-slate-50 text-[#1D3B58] text-[15px] font-bold py-3.5 px-6 rounded-full border border-[#2E5780]/70 transition-colors duration-200 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </section>
          </>
        ) : (
          /* ================= STATE BERHASIL DICATAT ================= */
          <div className="mt-3">
            <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
              Pengukuran berhasil dicatat.
            </h1>

            {/* Banner Catatan Biru Muda */}
            <div className="mt-5 bg-[#B5D5F0] rounded-[16px] px-6 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[#1D3B58]">
              <p className="text-[13.5px] font-bold">Catatan:</p>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed">
                Pastikan hasil timbang dan ukur sudah sesuai dengan Buku KIA
                sebelum sesi pelayanan berikutnya.
              </p>
            </div>

            {/* Tombol CTA Lihat Data Balita */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/kader/data-balita')}
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <span>Lihat data balita</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CatatPengukuran;