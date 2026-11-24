import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import NavbarOrtu from '../../components/layout/NavbarOrtu';

export default function KonfirmasiPenyimpanan() {
  const location = useLocation();

  // Mengambil data anak yang baru disimpan dari state navigasi (default ke Aruna Putri)
  const savedChild = location.state || {
    namaLengkap: 'Aruna Putri',
    namaPanggilan: 'Aruna',
    usiaTeks: '18 bulan',
    namaPosyandu: 'Posyandu Melati 01',
  };

  const NEXT_ACTIONS = [
    {
      title: 'Lihat grafik pertumbuhan',
      subtitle: `Pantau perubahan berat dan tinggi badan ${savedChild.namaPanggilan}`,
      to: '/ortu/pertumbuhan',
    },
    {
      title: 'Cek jadwal imunisasi',
      subtitle: 'Lihat imunisasi sesuai usia anak',
      to: '/ortu/imunisasi',
    },
    {
      title: 'Lihat jadwal posyandu',
      subtitle: 'Kegiatan terdekat di posyandu Anda',
      to: '/ortu/jadwal-posyandu',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Label Atas */}
        <p className="text-xs font-semibold text-[#2E5780]">
          Profil anak
        </p>

        {/* Judul & Subjudul */}
        <h1 className="text-2xl sm:text-[34px] font-bold text-[#2E5780] tracking-tight mt-1">
          Profil berhasil disimpan
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 mt-1.5">
          Data keluarga sudah diperbarui dalam contoh alur prototipe
        </p>

        {/* Grid 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 mt-6 items-start">
          
          {/* Kolom Kiri: Kartu Status Biru Muda */}
          <section className="lg:col-span-5 bg-[#C5E3FA] rounded-[24px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            {/* Badge Status Tersimpan */}
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#2E5780] text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[2.75]" />
              </span>
              <span className="text-sm font-bold text-[#2E5780]">
                Tersimpan
              </span>
            </div>

            {/* Nama & Ringkasan Usia */}
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#1E293B] tracking-tight mt-4">
              {savedChild.namaLengkap}
            </h2>
            <p className="text-xs sm:text-[13px] font-medium text-[#1E293B] mt-1">
              {savedChild.usiaTeks} · {savedChild.namaPosyandu}
            </p>

            <p className="text-xs sm:text-[13px] text-[#1E293B] leading-relaxed mt-5">
              Selanjutnya, buka beranda untuk melihat catatan dan jadwal anak.
            </p>

            {/* Dua Tombol Aksi */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link
                to="/ortu/dashboard"
                className="flex-1 sm:flex-none text-center bg-[#2E5780] hover:bg-[#234466] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Kembali ke beranda
              </Link>

              <Link
                to="/ortu/profil-anak"
                className="flex-1 sm:flex-none text-center bg-white hover:bg-slate-50 border border-[#2E5780] text-[#2E5780] text-xs font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Edit profil
              </Link>
            </div>
          </section>

          {/* Kolom Kanan: Kartu Langkah Berikutnya */}
          <aside className="lg:col-span-7 bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h2 className="text-lg sm:text-[20px] font-bold text-[#1E293B] tracking-tight">
              Langkah berikutnya
            </h2>

            <div className="mt-4 space-y-3">
              {NEXT_ACTIONS.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  className="bg-[#F7F5F0] hover:bg-[#EFECE4] rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 transition-colors group"
                >
                  <div>
                    <p className="text-xs sm:text-[13px] font-bold text-[#1E293B]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#2E5780] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}