import React, { useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';
import SidebarKader from '../../Components/layout/SidebarKader';
import { BALITA_STORAGE_KEY } from './DataBalita';

const JENIS_KELAMIN_OPTIONS = ['Laki-laki', 'Perempuan'];

const AKUN_WALI_SUGGESTIONS = [
  'nadia.putri@email.com (Nadia Putri)',
  'dewi.pratama@email.com (Dewi Pratama)',
  'rizal.safira@email.com (Rizal Safira)',
  '081234567890 (Dina Amelia)',
];

const hitungUsiaBulan = (tanggalLahirStr) => {
  if (!tanggalLahirStr) return 12;
  const birthDate = new Date(tanggalLahirStr);
  if (Number.isNaN(birthDate.getTime())) return 12;

  const refDate = new Date('2026-11-28');
  const months =
    (refDate.getFullYear() - birthDate.getFullYear()) * 12 +
    (refDate.getMonth() - birthDate.getMonth());

  return Math.max(1, months);
};

const ekstrakNamaWali = (akunInput) => {
  const matchKurung = akunInput.match(/\(([^)]+)\)/);
  if (matchKurung) return matchKurung[1].trim();

  if (akunInput.includes('@')) {
    const prefix = akunInput.split('@')[0].replace(/[._-]/g, ' ');
    return prefix.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return akunInput.trim() || 'Wali Terdaftar';
};

const TambahBalita = () => {
  const dateInputRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    namaAnak: '',
    tanggalLahir: '',
    jenisKelamin: '',
    posyandu: 'Melati 01',
    akunWali: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.type = 'date';
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.namaAnak.trim() ||
      !formData.tanggalLahir.trim() ||
      !formData.jenisKelamin ||
      !formData.posyandu.trim() ||
      !formData.akunWali.trim()
    ) {
      setErrorMsg(
        'Mohon lengkapi seluruh data balita, posyandu, dan akun orang tua/wali.'
      );
      return;
    }

    const usiaBulan = hitungUsiaBulan(formData.tanggalLahir);

    const newBalita = {
      id: Date.now(),
      nama: formData.namaAnak.trim(),
      usiaBulan,
      usiaText: `${usiaBulan} bulan`,
      jenisKelamin: formData.jenisKelamin,
      wali: ekstrakNamaWali(formData.akunWali),
      posyandu: formData.posyandu.trim(),
      akunWali: formData.akunWali.trim(),
      kunjunganTerakhir: '28 Nov 2026',
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(BALITA_STORAGE_KEY) || '[]'
      );
      localStorage.setItem(
        BALITA_STORAGE_KEY,
        JSON.stringify([newBalita, ...existing])
      );
    } catch {
      // Abaikan jika localStorage dibatasi browser
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      {/* Sidebar Kiri (Menu "Data balita" aktif) */}
      <SidebarKader />

      {/* Konten Utama Kanan */}
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {!isSubmitted ? (
          <>
            {/* Breadcrumb Form */}
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
                Data Balita
              </Link>
              <span>/</span>
              <span className="text-[#1D3B58] font-semibold">
                Tambah balita binaan
              </span>
            </nav>

            {/* Judul & Subjudul Halaman */}
            <div className="mt-3">
              <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
                Hubungkan balita dengan keluarga
              </h1>
              <p className="mt-1 text-[14px] text-[#475569]">
                Pastikan akun wali dan posyandu sesuai
              </p>
            </div>

            {/* Kartu Form Putih */}
            <section className="mt-6 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-5">
                Data balita
              </h2>

              {errorMsg && (
                <div className="mb-5 rounded-[14px] bg-orange-50 border border-[#F3831E]/40 px-4 py-3 text-[13.5px] font-medium text-[#9A3412]">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama Anak */}
                <div>
                  <label
                    htmlFor="namaAnakBinaan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Nama Anak
                  </label>
                  <input
                    id="namaAnakBinaan"
                    type="text"
                    value={formData.namaAnak}
                    onChange={(e) => handleChange('namaAnak', e.target.value)}
                    placeholder="Masukkan nama anak"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* Baris 2 Kolom: Tanggal Lahir & Jenis Kelamin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tanggal Lahir */}
                  <div>
                    <label
                      htmlFor="tanggalLahirBalita"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Tanggal Lahir
                    </label>
                    <div className="relative">
                      <input
                        ref={dateInputRef}
                        id="tanggalLahirBalita"
                        type="text"
                        value={formData.tanggalLahir}
                        onFocus={(e) => {
                          e.target.type = 'date';
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        onChange={(e) =>
                          handleChange('tanggalLahir', e.target.value)
                        }
                        placeholder="Pilih tanggal"
                        className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] pl-4 pr-11 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0"
                      />
                      <button
                        type="button"
                        onClick={handleOpenDatePicker}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#1D3B58] cursor-pointer"
                        aria-label="Pilih tanggal lahir"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="relative">
                    <label className="block text-[13.5px] font-bold text-[#1D3B58] mb-2">
                      Jenis Kelamin
                    </label>
                    <button
                      type="button"
                      onClick={() => setGenderDropdownOpen((prev) => !prev)}
                      className={`w-full bg-white border border-slate-300/90 hover:border-[#2E5780]/70 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-left transition-colors cursor-pointer ${
                        formData.jenisKelamin
                          ? 'text-[#1E293B]'
                          : 'text-slate-400'
                      }`}
                    >
                      {formData.jenisKelamin || 'Pilih jenis kelamin'}
                    </button>

                    {genderDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-20">
                        {JENIS_KELAMIN_OPTIONS.map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => {
                              handleChange('jenisKelamin', gender);
                              setGenderDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                              formData.jenisKelamin === gender
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

                {/* Posyandu */}
                <div>
                  <label
                    htmlFor="posyanduBalita"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Posyandu
                  </label>
                  <input
                    id="posyanduBalita"
                    type="text"
                    value={formData.posyandu}
                    onChange={(e) => handleChange('posyandu', e.target.value)}
                    placeholder="Melati 01"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#475569] focus:text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* Akun orang tua / wali */}
                <div>
                  <label
                    htmlFor="akunWaliBalita"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Akun orang tua/ wali
                  </label>
                  <input
                    id="akunWaliBalita"
                    list="akun-wali-suggestions"
                    type="text"
                    value={formData.akunWali}
                    onChange={(e) => handleChange('akunWali', e.target.value)}
                    placeholder="Cari email atau nomor telepon wali"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                  <datalist id="akun-wali-suggestions">
                    {AKUN_WALI_SUGGESTIONS.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </div>

                {/* Tombol Simpan & Hubungkan */}
                <div className="pt-14 sm:pt-20">
                  <button
                    type="submit"
                    className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    Simpan &amp; Hubungkan
                  </button>
                </div>
              </form>
            </section>
          </>
        ) : (
          /* ================= STATE KONFIRMASI BERHASIL TERSIMPAN ================= */
          <div>
            {/* Breadcrumb Konfirmasi */}
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
              <span className="text-[#1D3B58] font-semibold">
                Data balita tersimpan
              </span>
            </nav>

            <div className="mt-3">
              <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
                Data balita berhasil tersimpan
              </h1>
              <p className="mt-1.5 text-[14px] text-[#334155]">
                Hubungan anak, wali, dan posyandu telah dicatat.
              </p>
            </div>

            {/* Banner Biru Muda */}
            <div className="mt-5 bg-[#B5D5F0] rounded-[16px] px-6 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[#1D3B58] min-h-[84px] flex flex-col justify-center">
              <p className="text-[13px] font-semibold">Simulasi prototipe</p>
            </div>

            {/* Tombol Kembali ke Pengelolaan */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.visit('/kader/data-balita')}
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <span>Kembali ke pengelolaan</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TambahBalita;