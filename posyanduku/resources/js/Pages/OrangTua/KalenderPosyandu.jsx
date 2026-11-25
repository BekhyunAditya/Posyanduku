import { useState } from 'react';
import { Link } from '@inertiajs/react';
import NavbarOrtu from '@/Components/layout/NavbarOrtu';

const DAYS_OF_WEEK = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

// Data jadwal kegiatan pada bulan November 2026 (sementara sebelum terhubung ke API Laravel)
const SCHEDULE_EVENTS = {
  20: {
    day: 20,
    badgeLabel: 'Posyandu',
    variant: 'primary', // Biru tua (#2E5780)
    headerTitle: 'Kegiatan Terdekat',
    tanggalLengkap: '20 November 2026',
    judulKegiatan: 'Penimbangan & pelayanan balita',
    waktu: '08:00 – 11:00 WIB',
    lokasi: 'Balai RW 03 Posyandu Melati 01',
    perlengkapan: [
      'Buku KIA',
      'Keperluan anak',
      'Catatan yang ingin dikonsultasikan',
    ],
  },
  15: {
    day: 15,
    badgeLabel: '',
    variant: 'secondary', // Biru muda (#B5D5F0)
    headerTitle: 'Kegiatan Terjadwal',
    tanggalLengkap: '15 November 2026',
    judulKegiatan: 'Penyuluhan gizi & MPASI balita',
    waktu: '09:00 – 11:00 WIB',
    lokasi: 'Balai RW 03 Posyandu Melati 01',
    perlengkapan: [
      'Buku KIA',
      'Buku catatan makan anak',
      'Pertanyaan seputar MPASI',
    ],
  },
};

// Membangun 42 kotak kalender (6 baris x 7 hari) untuk November 2026
// 1 November 2026 jatuh pada hari Minggu (index ke-6 setelah Sen-Sab)
function buildNovember2026Grid() {
  const leadingEmpty = Array.from({ length: 6 }, (_, i) => ({
    key: `empty-start-${i}`,
    day: null,
  }));
  const days = Array.from({ length: 30 }, (_, i) => ({
    key: `day-${i + 1}`,
    day: i + 1,
  }));
  const trailingEmpty = Array.from({ length: 6 }, (_, i) => ({
    key: `empty-end-${i}`,
    day: null,
  }));

  return [...leadingEmpty, ...days, ...trailingEmpty];
}

export default function KalenderPosyandu() {
  const [selectedDay, setSelectedDay] = useState(20);
  const calendarCells = buildNovember2026Grid();

  const activeEvent = SCHEDULE_EVENTS[selectedDay] || SCHEDULE_EVENTS[20];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua (Menu "Jadwal" otomatis aktif) */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

          {/* Kolom Kiri: Kartu Kalender Kegiatan Posyandu */}
          <section className="lg:col-span-8 bg-white rounded-[28px] p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
              Kalender Kegiatan Posyandu
            </h1>

            <h2 className="text-lg sm:text-[21px] font-medium text-[#2E5780] mt-2.5">
              Bulan November 2026
            </h2>

            {/* Header Nama Hari */}
            <div className="grid grid-cols-7 gap-2 sm:gap-2.5 mt-6">
              {DAYS_OF_WEEK.map((dayName) => (
                <div
                  key={dayName}
                  className="text-[11px] font-medium text-slate-600 pl-1"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Kisi Tanggal (6 Baris x 7 Kolom) */}
            <div className="grid grid-cols-7 gap-2 sm:gap-2.5 mt-2">
              {calendarCells.map((cell) => {
                if (!cell.day) {
                  return (
                    <div
                      key={cell.key}
                      className="h-12 sm:h-14 rounded-xl bg-[#F7F5F0]"
                    />
                  );
                }

                const eventInfo = SCHEDULE_EVENTS[cell.day];
                const isPrimaryEvent = eventInfo?.variant === 'primary';
                const isSecondaryEvent = eventInfo?.variant === 'secondary';
                const isClickable = Boolean(eventInfo);

                let cellStyle = 'bg-[#F7F5F0] text-[#1D3B58]';
                if (isPrimaryEvent) {
                  cellStyle = 'bg-[#2E5780] text-white shadow-sm';
                } else if (isSecondaryEvent) {
                  cellStyle = 'bg-[#B5D5F0] text-[#1D3B58]';
                }

                return (
                  <button
                    key={cell.key}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && setSelectedDay(cell.day)}
                    className={`h-12 sm:h-14 rounded-xl p-2 flex flex-col justify-between items-start text-left transition-all ${cellStyle} ${
                      isClickable
                        ? 'cursor-pointer hover:opacity-95 ring-offset-1 focus:outline-none focus:ring-2 focus:ring-[#2E5780]'
                        : 'cursor-default'
                    } ${
                      selectedDay === cell.day && isSecondaryEvent
                        ? 'ring-2 ring-[#2E5780]'
                        : ''
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-medium leading-none">
                      {cell.day}
                    </span>

                    {eventInfo?.badgeLabel && (
                      <span className="text-[9px] sm:text-[10px] font-medium text-white/95 leading-none truncate w-full">
                        {eventInfo.badgeLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tombol Bawah */}
            <div className="mt-7">
              <Link
                href="/ortu/panduan-kunjungan"
                className="inline-block bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Lihat Kalender Posyandu
              </Link>
            </div>
          </section>

          {/* Kolom Kanan: Kartu Kegiatan Terdekat & Yang Perlu Dibawa */}
          <aside className="lg:col-span-4 bg-white rounded-[28px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl sm:text-[22px] font-bold text-[#2E5780] tracking-tight">
              {activeEvent.headerTitle}
            </h2>

            <p className="text-lg sm:text-[21px] font-bold text-[#F3831E] mt-3">
              {activeEvent.tanggalLengkap}
            </p>

            <h3 className="text-lg sm:text-[20px] font-bold text-[#2E5780] leading-snug mt-3">
              {activeEvent.judulKegiatan}
            </h3>

            <p className="text-base sm:text-[18px] font-bold italic text-[#2E5780] mt-3.5">
              {activeEvent.waktu}
            </p>

            <p className="text-xs sm:text-[13px] font-medium text-[#2E5780] mt-3">
              {activeEvent.lokasi}
            </p>

            {/* Garis Pemisah Oranye */}
            <hr className="border-t-2 border-[#F3831E] my-5" />

            {/* Daftar Perlengkapan */}
            <h3 className="text-lg sm:text-[20px] font-bold text-[#2E5780] tracking-tight">
              Yang perlu dibawa
            </h3>

            <ul className="mt-4 space-y-3.5">
              {activeEvent.perlengkapan.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#2E5780] shrink-0" />
                  <span className="text-xs sm:text-[13px] font-semibold text-[#2E5780] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            {/* Tombol Pintasan ke Checklist Kesiapan */}
            <div className="mt-6 flex justify-center">
              <Link
                href="/ortu/panduan-kunjungan"
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-7 py-3 rounded-2xl transition-colors text-center"
              >
                Buka checklist kesiapan
              </Link>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}