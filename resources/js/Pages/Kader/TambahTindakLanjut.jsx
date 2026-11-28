import React, { useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';
import SidebarKader from '../../Components/layout/SidebarKader';
import { TINDAK_LANJUT_STORAGE_KEY } from './TindakLanjut';

const NAMA_ANAK_SUGGESTIONS = [
  'Aruna Putri',
  'Bima Pratama',
  'Naila Safira',
  'Raka Aditya',
  'Kirana Putri',
  'Dimas Saputra',
  'Annisa Lestari',
];

const KONDISI_SUGGESTIONS = [
  'Berat belum naik',
  'Imunisasi tertunda',
  'Verifikasi catatan',
  'Pemantauan vitamin',
  'Rawan gizi',
  'Kunjungan ulang',
];

const formatDateIndo = (isoOrText) => {
  if (!isoOrText) return { short: '20 Nov 2026', full: '20 November 2026' };

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  // Jika input berasal dari <input type="date"> (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrText)) {
    const [year, monthStr, dayStr] = isoOrText.split('-');
    const monthIdx = Math.max(0, Math.min(11, parseInt(monthStr, 10) - 1));
    const day = parseInt(dayStr, 10);
    return {
      short: `${day} ${shortMonthNames[monthIdx]} ${year}`,
      full: `${day} ${monthNames[monthIdx]} ${year}`,
    };
  }

  let shortText = isoOrText;
  monthNames.forEach((full, idx) => {
    if (shortText.includes(full)) {
      shortText = shortText.replace(full, shortMonthNames[idx]);
    }
  });

  return { short: shortText, full: isoOrText };
};

const TambahTindakLanjut = () => {
  const dateInputRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    namaAnak: '',
    kondisi: '',
    rencana: '',
    tanggal: '',
    petugas: '',
    catatan: '',
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
      !formData.kondisi.trim() ||
      !formData.rencana.trim() ||
      !formData.tanggal.trim() ||
      !formData.petugas.trim()
    ) {
      setErrorMsg(
        'Mohon lengkapi nama anak, kondisi, rencana tindak lanjut, tanggal, dan petugas.'
      );
      return;
    }

    const { short, full } = formatDateIndo(formData.tanggal.trim());

    const newPendampingan = {
      id: Date.now(),
      namaAnak: formData.namaAnak.trim(),
      kondisiBadge: formData.kondisi.trim(),
      kondisiDetail: formData.kondisi.trim(),
      rencana: formData.rencana.trim(),
      jadwalShort: short,
      tanggalLengkap: full,
      petugas: formData.petugas.trim(),
      catatan: formData.catatan.trim(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(TINDAK_LANJUT_STORAGE_KEY) || '[]'
      );
      localStorage.setItem(
        TINDAK_LANJUT_STORAGE_KEY,
        JSON.stringify([newPendampingan, ...existing])
      );
    } catch {
      // Abaikan jika penyimpanan lokal dibatasi browser
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      <SidebarKader />

      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
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
            href="/kader/tindak-lanjut"
            className="hover:text-[#2E5780] transition-colors"
          >
            Tindak Lanjut
          </Link>
          <span>/</span>
          <span className="text-[#1D3B58] font-semibold">
            Tambah pendampingan
          </span>
        </nav>

        {!isSubmitted ? (
          <>
            <div className="mt-3">
              <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
                Tambahkan pendampingan
              </h1>
              <p className="mt-1 text-[14px] text-[#475569]">
                Pantau kebutuhan dan tindak lanjut balita.
              </p>
            </div>

            {/* Kartu Form Tambah Pendampingan */}
            <section className="mt-6 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-5">
                Tindak Lanjut
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
                    htmlFor="tambahNamaAnak"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Nama Anak
                  </label>
                  <input
                    id="tambahNamaAnak"
                    list="tindak-lanjut-anak-options"
                    type="text"
                    value={formData.namaAnak}
                    onChange={(e) => handleChange('namaAnak', e.target.value)}
                    placeholder="Masukkan nama anak"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                  <datalist id="tindak-lanjut-anak-options">
                    {NAMA_ANAK_SUGGESTIONS.map((nama) => (
                      <option key={nama} value={nama} />
                    ))}
                  </datalist>
                </div>

                {/* Kondisi */}
                <div>
                  <label
                    htmlFor="tambahKondisi"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Kondisi
                  </label>
                  <input
                    id="tambahKondisi"
                    list="tindak-lanjut-kondisi-options"
                    type="text"
                    value={formData.kondisi}
                    onChange={(e) => handleChange('kondisi', e.target.value)}
                    placeholder="Masukkan kondisi anak"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                  <datalist id="tindak-lanjut-kondisi-options">
                    {KONDISI_SUGGESTIONS.map((kondisi) => (
                      <option key={kondisi} value={kondisi} />
                    ))}
                  </datalist>
                </div>

                {/* Rencana Tindak Lanjut */}
                <div>
                  <label
                    htmlFor="tambahRencana"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Rencana Tindak Lanjut
                  </label>
                  <input
                    id="tambahRencana"
                    type="text"
                    value={formData.rencana}
                    onChange={(e) => handleChange('rencana', e.target.value)}
                    placeholder="Tambahkan rencana tindak lanjut"
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* Tanggal & Petugas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="tambahTanggal"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Tanggal
                    </label>
                    <div className="relative">
                      <input
                        ref={dateInputRef}
                        id="tambahTanggal"
                        type="text"
                        value={formData.tanggal}
                        onFocus={(e) => {
                          e.target.type = 'date';
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        onChange={(e) =>
                          handleChange('tanggal', e.target.value)
                        }
                        placeholder="Pilih tanggal"
                        className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] pl-4 pr-11 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0"
                      />
                      <button
                        type="button"
                        onClick={handleOpenDatePicker}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#1D3B58] cursor-pointer"
                        aria-label="Pilih tanggal tindak lanjut"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="tambahPetugas"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Petugas
                    </label>
                    <input
                      id="tambahPetugas"
                      type="text"
                      value={formData.petugas}
                      onChange={(e) => handleChange('petugas', e.target.value)}
                      placeholder="Masukkan nama petugas"
                      className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] font-medium text-[#1E293B] placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Catatan (opsional) */}
                <div>
                  <label
                    htmlFor="tambahCatatan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Catatan (opsional)
                  </label>
                  <textarea
                    id="tambahCatatan"
                    rows={3}
                    value={formData.catatan}
                    onChange={(e) => handleChange('catatan', e.target.value)}
                    placeholder="Tambahkan catatan pendampingan...."
                    className="w-full bg-white border border-slate-300/90 focus:border-[#2E5780] focus:outline-none rounded-[14px] px-4 py-3 text-[14.5px] text-[#1E293B] placeholder:text-slate-400 resize-none transition-colors"
                  />
                </div>

                {/* Tombol Simpan data & Batal */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="w-full bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold py-3.5 px-6 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    Simpan data
                  </button>

                  <button
                    type="button"
                    onClick={() => router.visit('/kader/tindak-lanjut')}
                    className="w-full bg-white hover:bg-slate-50 text-[#1D3B58] text-[15px] font-bold py-3.5 px-6 rounded-full border border-[#2E5780]/70 transition-colors duration-200 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </section>
          </>
        ) : (
          /* ================= STATE KONFIRMASI BERHASIL DISIMPAN ================= */
          <div className="mt-3">
            <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
              Tindak lanjut telah disimpan.
            </h1>

            <div className="mt-5 bg-[#B5D5F0] rounded-[16px] px-6 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[#1D3B58] min-h-[84px] flex flex-col justify-center">
              <p className="text-[13px] font-medium leading-relaxed">
                Jadwal tersimpan di daftar tindak lanjut dan siap dipantau
                menjelang hari konsultasi.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.visit('/kader/tindak-lanjut')}
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <span>Lihat tindak lanjut</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TambahTindakLanjut;