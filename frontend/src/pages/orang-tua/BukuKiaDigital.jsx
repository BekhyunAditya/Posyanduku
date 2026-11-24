import { Link } from 'react-router-dom';
import NavbarOrtu from '../../components/layout/NavbarOrtu';

// Dummy data sementara sebelum terhubung ke API Laravel (GET /api/ortu/balita/:id/buku-kia)
const BUKU_KIA_DATA = {
  namaPanggilan: 'Aruna',
  linimasa: [
    {
      id: 1,
      tanggal: '10 Nov 2026',
      aktivitas: 'Pengukuran bulanan',
      catatan: 'Berat 10,2 kg · panjang 80,5 cm',
      status: 'Tercatat oleh kader',
    },
    {
      id: 2,
      tanggal: '10 Nov 2026',
      aktivitas: 'Catatan imunisasi keluarga',
      catatan: 'Perlu dicocokkan dengan Buku KIA',
      status: 'Menunggu verifikasi',
    },
    {
      id: 3,
      tanggal: '10 Okt 2026',
      aktivitas: 'Pengukuran bulanan',
      catatan: 'Berat 10,2 kg · panjang 79,8 cm',
      status: 'Tercatat oleh kader',
    },
    {
      id: 4,
      tanggal: '10 Sep 2026',
      aktivitas: 'Kunjungan posyandu',
      catatan: 'Pengukuran dan pendampingan',
      status: 'Tercatat oleh kader',
    },
  ],
  ringkasan: {
    pengukuranTerakhir: '10,2 kg',
    detailPengukuran: 'Panjang 80,5 cm · 10 Nov',
    totalKunjungan: '6 kali',
    periodeKunjungan: 'Juni–November 2026',
  },
};

export default function BukuKiaDigital() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Kartu Putih Utama */}
        <section className="bg-white rounded-[28px] p-7 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {/* Judul Halaman */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
            Buku KIA pendamping {BUKU_KIA_DATA.namaPanggilan}
          </h1>

          {/* Subjudul Bagian Tabel */}
          <h2 className="text-lg sm:text-[21px] font-semibold text-[#2E5780] tracking-tight mt-6">
            Linimasa kunjungan
          </h2>

          {/* Tabel Linimasa Kunjungan */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left border-collapse">
              <thead>
                <tr className="bg-[#FDF2E6] text-[#1E293B] text-xs font-bold">
                  <th className="py-3 px-4 rounded-l-xl">Tanggal</th>
                  <th className="py-3 px-4">Aktivitas</th>
                  <th className="py-3 px-4">Catatan</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#1E293B]">
                {BUKU_KIA_DATA.linimasa.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#5C7B99]/75 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-3.5 px-4">{item.aktivitas}</td>
                    <td className="py-3.5 px-4">{item.catatan}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2 Kartu Ringkasan (Pengukuran Terakhir & Kunjungan) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mt-7">
            {/* Kartu Pengukuran Terakhir */}
            <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.06)] border border-slate-100/80">
              <p className="text-xs font-medium text-slate-600">
                Pengukuran terakhir
              </p>
              <p className="text-2xl sm:text-[28px] font-bold text-[#2E5780] mt-1.5">
                {BUKU_KIA_DATA.ringkasan.pengukuranTerakhir}
              </p>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {BUKU_KIA_DATA.ringkasan.detailPengukuran}
              </p>
            </div>

            {/* Kartu Total Kunjungan */}
            <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.06)] border border-slate-100/80">
              <p className="text-xs font-medium text-slate-600">
                Kunjungan
              </p>
              <p className="text-2xl sm:text-[28px] font-bold text-[#2E5780] mt-1.5">
                {BUKU_KIA_DATA.ringkasan.totalKunjungan}
              </p>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {BUKU_KIA_DATA.ringkasan.periodeKunjungan}
              </p>
            </div>
          </div>

          {/* Tombol Navigasi Bawah */}
          <div className="flex flex-wrap items-center gap-3.5 mt-7">
            <Link
              to="/ortu/pertumbuhan"
              className="bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Lihat Pertumbuhan
            </Link>

            <Link
              to="/ortu/imunisasi"
              className="border border-[#2E5780] text-[#2E5780] hover:bg-slate-50 text-xs sm:text-[13px] font-semibold px-7 py-2.5 rounded-full transition-colors"
            >
              Lihat Imunisasi
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}