import { Link, useLocation } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import NavbarOrtu from '../../components/layout/NavbarOrtu';

export default function CatatanTersimpan() {
  const location = useLocation();

  const savedNote = location.state || {
    tanggalKunjungan: '15 Mei 2025',
    halDibahas: '',
    pertanyaanPetugas: '',
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua (Menu "Panduan" otomatis mendapat garis bawah aktif) */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Kolom Kiri: Status & Navigasi Kembali */}
          <section className="lg:col-span-6">
            {/* Badge Pill Atas */}
            <span className="inline-block bg-[#CBE5FA] text-[#1E4E79] text-xs font-semibold px-4 py-1.5 rounded-full">
              Catatan keluarga
            </span>

            {/* Judul & Subjudul */}
            <h1 className="text-3xl sm:text-[34px] font-bold text-[#2E5780] tracking-tight mt-4 leading-tight">
              Catatan konsultasi tersimpan
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 mt-2">
              Buka kembali saat kunjungan berikutnya
            </p>

            {/* Dua Tombol Aksi */}
            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <Link
                to="/ortu/panduan-kunjungan"
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-7 py-3 rounded-xl transition-colors"
              >
                Kembali ke panduan
              </Link>

              <Link
                to="/ortu/panduan-kunjungan/catatan"
                className="bg-white hover:bg-slate-50 border border-[#2E5780] text-[#2E5780] text-xs sm:text-[13px] font-semibold px-9 py-3 rounded-xl transition-colors"
              >
                Baca catatan
              </Link>
            </div>

            {/* Dua Kapsul Informasi */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="inline-flex items-center gap-2 border border-[#BAE0FD] bg-white/70 rounded-full px-3.5 py-1.5">
                <span className="w-5 h-5 rounded-full bg-[#2E5780] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span className="text-[11px] font-medium text-slate-700">
                  Tersimpan pada {savedNote.tanggalKunjungan}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 border border-[#BAE0FD] bg-white/70 rounded-full px-3.5 py-1.5">
                <span className="w-5 h-5 rounded-full bg-[#CBE5FA] text-[#2E5780] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className="text-[11px] font-medium text-slate-700">
                  Bisa dibuka dari menu Panduan
                </span>
              </div>
            </div>

            {/* Catatan Kaki Pendampingan */}
            <p className="text-[11px] text-slate-500 mt-4">
              Catatan ini untuk pendampingan, bukan pengganti arahan tenaga kesehatan.
            </p>
          </section>

          {/* Kolom Kanan: Kartu Biru Muda Ringkasan Catatan */}
          <aside className="lg:col-span-6 bg-[#C5E3FA] rounded-[24px] p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            {/* Baris Status */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#2E5780] text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[2.75]" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#2E5780]">
                Tersimpan di akun Anda
              </span>
            </div>

            {/* Subjudul Kartu */}
            <h2 className="text-lg sm:text-[20px] font-bold text-[#1E293B] tracking-tight mt-6">
              Catatan konsultasi
            </h2>

            {/* Garis Pemisah */}
            <hr className="border-t border-[#93BFE3] my-4" />

            {/* Ilustrasi Baris Catatan Tersimpan */}
            <div className="space-y-3 py-2">
              <div className="h-2.5 w-[92%] rounded-full bg-white" />
              <div className="h-2.5 w-[78%] rounded-full bg-white" />
              <div className="h-2.5 w-[85%] rounded-full bg-white" />
              <div className="h-2.5 w-[65%] rounded-full bg-white" />
            </div>

            {/* Keterangan Bawah */}
            <p className="text-xs text-[#1E293B] mt-7">
              Terhubung ke profil anak Anda.
            </p>
          </aside>

        </div>
      </main>
    </div>
  );
}