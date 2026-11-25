import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import NavbarOrtu from '@/Components/layout/NavbarOrtu';

const NOTIFICATION_STORAGE_KEY = 'posyanduku_notifications_enabled';

export default function NotifikasiPengingat() {
  const [isNotifEnabled, setIsNotifEnabled] = useState(() => {
    try {
      return localStorage.getItem(NOTIFICATION_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, String(isNotifEnabled));
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
  }, [isNotifEnabled]);

  const handleToggleNotification = async () => {
    const nextState = !isNotifEnabled;
    setIsNotifEnabled(nextState);

    if (nextState && 'Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // Abaikan jika browser memblokir permintaan izin
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Judul Halaman */}
        <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
          Notifikasi & Pengingat
        </h1>

        {/* Tata Letak 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 mt-6 items-start">

          {/* Kolom Kiri: Daftar 3 Kartu Pengingat */}
          <div className="lg:col-span-7 space-y-5">

            {/* Kartu 1: Kunjungan Posyandu */}
            <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg sm:text-[19px] font-bold text-[#2E5780]">
                Kunjungan Posyandu Melati 01
              </h2>

              <div className="mt-3">
                <span className="inline-block bg-[#2E5780] text-white text-sm sm:text-base font-semibold px-4 py-1 rounded-full">
                  20 November
                </span>
              </div>

              <p className="text-base sm:text-lg font-bold italic text-[#F3831E] mt-3">
                08:00 – 11:00 WIB
              </p>

              <p className="text-sm sm:text-[15px] font-bold text-[#2E5780] mt-2.5">
                Balai RW 03 Posyandu Melati
              </p>

              <div className="mt-4">
                <Link
                  href="/ortu/panduan-kunjungan"
                  className="inline-block border border-[#2E5780] text-[#2E5780] hover:bg-slate-50 text-xs font-semibold px-8 py-2 rounded-full transition-colors"
                >
                  Buka Checklist
                </Link>
              </div>
            </section>

            {/* Kartu 2: Hasil Pengukuran Anak */}
            <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg sm:text-[19px] font-bold text-[#2E5780]">
                Hasil Pengukuran Anak
              </h2>

              <div className="mt-3">
                <span className="inline-block bg-[#2E5780] text-white text-sm sm:text-base font-semibold px-4 py-1 rounded-full">
                  10 November
                </span>
              </div>

              <p className="text-sm sm:text-[15px] font-bold text-[#2E5780] mt-3.5">
                Catatan pengukuran Aruna
              </p>

              <div className="mt-4">
                <Link
                  href="/ortu/pertumbuhan"
                  className="inline-block border border-[#2E5780] text-[#2E5780] hover:bg-slate-50 text-xs font-semibold px-10 py-2 rounded-full transition-colors"
                >
                  Lihat Hasil
                </Link>
              </div>
            </section>

            {/* Kartu 3: Catatan Imunisasi */}
            <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg sm:text-[19px] font-bold text-[#2E5780]">
                Catatan Imunisasi
              </h2>

              <p className="text-base sm:text-lg font-bold italic text-[#F3831E] leading-snug mt-3 max-w-md">
                Satu catatan masih menunggu verifikasi tenaga kesehatan
              </p>

              <div className="mt-4">
                <Link
                  href="/ortu/buku-kia"
                  className="inline-block border border-[#2E5780] text-[#2E5780] hover:bg-slate-50 text-xs font-semibold px-9 py-2 rounded-full transition-colors"
                >
                  Lihat Catatan
                </Link>
              </div>
            </section>

          </div>

          {/* Kolom Kanan: Kartu Biru Nyalakan Notifikasi */}
          <aside className="lg:col-span-5 bg-[#2E5780] rounded-[24px] p-8 sm:p-9 text-white shadow-[0_6px_24px_rgba(46,87,128,0.16)]">
            <h2 className="text-2xl sm:text-[32px] font-bold leading-[1.22] tracking-tight">
              Nyalakan
              <br />
              Notifikasi ??
            </h2>

            <p className="text-xs sm:text-sm font-semibold italic text-white/95 mt-4 leading-relaxed">
              Pengingat kecil,
              <br />
              pendampingan berlanjut.
            </p>

            {/* Kontrol Checkbox Interaktif */}
            <button
              type="button"
              onClick={handleToggleNotification}
              aria-pressed={isNotifEnabled}
              className="mt-7 flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none"
            >
              <span
                className={`w-7 h-7 rounded-lg border-2 border-white flex items-center justify-center shrink-0 transition-colors ${
                  isNotifEnabled
                    ? 'bg-white text-[#2E5780]'
                    : 'bg-transparent group-hover:bg-white/10'
                }`}
              >
                {isNotifEnabled && <Check className="w-4 h-4 stroke-[3]" />}
              </span>

              <span className="text-sm sm:text-[15px] font-semibold text-white">
                Nyalakan Notifikasi
              </span>
            </button>

            {isNotifEnabled && (
              <p className="text-[11px] text-white/80 mt-3">
                Pengingat jadwal posyandu dan hasil pengukuran aktif.
              </p>
            )}
          </aside>

        </div>
      </main>
    </div>
  );
}