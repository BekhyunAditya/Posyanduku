import { useState } from 'react';
import { router } from '@inertiajs/react';
import NavbarOrtu from '@/Components/layout/NavbarOrtu';
import ibuAnakImg from '@/Assets/images/ibu-anak-login.png';

const CONSULTATION_STORAGE_KEY = 'posyanduku_konsultasi_note';

export default function CatatanKonsultasi() {
  // Muat catatan tersimpan jika pengguna menekan "Baca catatan" dari halaman konfirmasi
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(CONSULTATION_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Abaikan jika storage tidak tersedia
    }
    return {
      tanggalKunjungan: '15 Mei 2025',
      halDibahas: '',
      pertanyaanPetugas: '',
    };
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi sesuai aturan user flow: pertahankan isian jika gagal
    if (!formData.halDibahas.trim() && !formData.pertanyaanPetugas.trim()) {
      setErrorMessage(
        'Silakan isi minimal hal yang ingin dibahas atau pertanyaan untuk petugas.'
      );
      return;
    }

    const savedPayload = {
      ...formData,
      tanggalKunjungan: formData.tanggalKunjungan.trim() || '20 November 2026',
    };

    try {
      localStorage.setItem(CONSULTATION_STORAGE_KEY, JSON.stringify(savedPayload));
    } catch {
      // Abaikan jika storage penuh
    }

    // Sementara sebelum terhubung ke API Laravel (POST /api/ortu/konsultasi)
    console.log('Catatan konsultasi tersimpan:', savedPayload);

    router.post('/ortu/panduan-kunjungan/catatan-tersimpan', savedPayload);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <section className="bg-white rounded-[28px] p-7 sm:p-11 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {/* Judul Halaman */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
            Catatan untuk konsultasi
          </h1>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Grid 2 Kolom: Foto Kiri & Form Catatan Kanan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-6 items-center">
            {/* Kolom Kiri: Kartu Foto Ibu Mencatat */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-[260px] aspect-[3/4] rounded-[22px] bg-gradient-to-b from-[#E5F0FA] via-[#CBE0F5] to-[#A4C6E8] overflow-hidden flex items-end justify-center shadow-[0_4px_16px_rgba(46,87,128,0.08)]">
                <img
                  src={ibuAnakImg}
                  alt="Catatan konsultasi orang tua"
                  className="w-full h-full object-cover object-top select-none"
                />
              </div>
            </div>

            {/* Kolom Kanan: Formulir Catatan Aruna */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-4">
              <h2 className="text-lg sm:text-[21px] font-bold text-[#F3831E] tracking-tight">
                Catatan Aruna
              </h2>

              {/* Input Tanggal Kunjungan */}
              <div>
                <label
                  htmlFor="tanggalKunjungan"
                  className="block text-xs font-bold text-[#1E293B] mb-1.5"
                >
                  Catatan untuk kunjungan pada tanggal :
                </label>
                <input
                  id="tanggalKunjungan"
                  name="tanggalKunjungan"
                  type="text"
                  required
                  value={formData.tanggalKunjungan}
                  onChange={handleChange}
                  placeholder="15 Mei 2025"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/75 text-xs sm:text-sm text-slate-600 focus:text-[#1E293B] focus:outline-none focus:border-[#2E5780] transition-colors"
                />
              </div>

              {/* Textarea Hal yang Ingin Dibahas */}
              <div>
                <label
                  htmlFor="halDibahas"
                  className="block text-xs font-bold text-[#1E293B] mb-1.5"
                >
                  Hal yang ingin dibahas :
                </label>
                <textarea
                  id="halDibahas"
                  name="halDibahas"
                  rows={3}
                  value={formData.halDibahas}
                  onChange={handleChange}
                  placeholder="Isi disini"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-400/75 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors resize-none"
                />
              </div>

              {/* Textarea Pertanyaan untuk Petugas */}
              <div>
                <label
                  htmlFor="pertanyaanPetugas"
                  className="block text-xs font-bold text-[#1E293B] mb-1.5"
                >
                  Pertanyaan untuk petugas :
                </label>
                <textarea
                  id="pertanyaanPetugas"
                  name="pertanyaanPetugas"
                  rows={3}
                  value={formData.pertanyaanPetugas}
                  onChange={handleChange}
                  placeholder="1. ..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-400/75 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors resize-none"
                />
              </div>

              {/* Tombol Simpan Catatan */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}