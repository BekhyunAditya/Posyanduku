import { Link } from '@inertiajs/react';
import NavbarOrtu from '@/Components/layout/NavbarOrtu';

// Dummy data sementara sebelum terhubung ke API Laravel (GET /api/ortu/balita/:id/imunisasi)
const IMUNISASI_DATA = {
  catatan: [
    {
      id: 1,
      pelayanan: 'Imunisasi tercatat di Buku KIA',
      tanggal: '15 Mei 2025',
      status: 'Sudah diberikan',
      verifikasi: 'Terverifikasi · Bidan Rina',
    },
    {
      id: 2,
      pelayanan: 'Imunisasi kunjungan sebelumnya',
      tanggal: '10 Juni 2026',
      status: 'Sudah diberikan',
      verifikasi: 'Terverifikasi · Bidan Rina',
    },
    {
      id: 3,
      pelayanan: 'Catatan baru dari keluarga',
      tanggal: '10 November 2026',
      status: 'Menunggu verifikasi',
      verifikasi: 'Belum diperiksa',
    },
    {
      id: 4,
      pelayanan: 'Imunisasi berikutnya',
      tanggal: 'Perlu konfirmasi',
      status: 'Belum dijadwalkan',
      verifikasi: 'Konfirmasi tenaga kesehatan',
    },
  ],
  kunjunganBerikutnya: {
    label: 'Konfirmasi pada kunjungan berikutnya',
    tanggal: '20 November 2026',
    catatan:
      'Bawa Buku KIA untuk mencocokkan riwayat imunisasi dan jadwal lanjutan.',
  },
};

export default function JadwalImunisasi() {
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
            Jadwal & riwayat imunisasi
          </h1>

          {/* Subjudul Bagian Tabel */}
          <h2 className="text-lg sm:text-[21px] font-semibold text-[#2E5780] tracking-tight mt-6">
            Catatan Imunisasi
          </h2>

          {/* Tabel Catatan Imunisasi */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F5F0] text-[#1E293B] text-xs font-bold">
                  <th className="py-3 px-4 rounded-l-xl">Pelayanan</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-xl">Verifikasi</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#1E293B]">
                {IMUNISASI_DATA.catatan.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#5C7B99]/75 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium">
                      {item.pelayanan}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.verifikasi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu Konfirmasi Kunjungan Berikutnya */}
          <div className="max-w-sm mt-7">
            <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.06)] border border-slate-100/80">
              <p className="text-xs font-medium text-slate-600">
                {IMUNISASI_DATA.kunjunganBerikutnya.label}
              </p>
              <p className="text-2xl sm:text-[26px] font-bold text-[#2E5780] tracking-tight mt-1.5">
                {IMUNISASI_DATA.kunjunganBerikutnya.tanggal}
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                {IMUNISASI_DATA.kunjunganBerikutnya.catatan}
              </p>
            </div>
          </div>

          {/* Tombol Navigasi Bawah */}
          <div className="flex flex-wrap items-center gap-3.5 mt-7">
            <Link
              href="/ortu/jadwal-posyandu"
              className="bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Lihat kalender posyandu
            </Link>

            <Link
              href="/ortu/buku-kia"
              className="border border-[#2E5780] text-[#2E5780] hover:bg-slate-50 text-xs sm:text-[13px] font-semibold px-7 py-2.5 rounded-full transition-colors"
            >
              Buka riwayat lengkap
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}