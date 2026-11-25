import { Link } from '@inertiajs/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import NavbarOrtu from '@/Components/layout/NavbarOrtu';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

// Dummy data sementara sebelum terhubung ke API Laravel (GET /api/ortu/dashboard)
const DASHBOARD_DATA = {
  namaOrangTua: 'Bunda Nadia',
  anak: {
    nama: 'Aruna Putri',
    posyandu: 'Posyandu Melati 01',
    usiaTeks: '18 Bulan Penuh Ceria',
  },
  kunjunganBerikutnya: {
    tanggal: '20 November',
    waktu: '08:00 – 11:00 WIB',
    tempat: 'Balai RW 03',
    posyandu: 'Posyandu Melati',
  },
  ringkasan: {
    beratBadan: '10,2 kg',
    tanggalUkur: 'Pengukuran 10 Nov 2026',
    panjangBadan: '80,5 cm',
    metodeUkur: 'Diukur berbaring',
    totalKunjungan: '6 kali',
    periodeKunjungan: 'Juni–November 2026',
  },
  grafikBerat: {
    labels: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
    values: [9.2, 9.5, 9.8, 10.0, 10.2, 10.2],
  },
  perluDicermati: {
    pesan: 'Berat badan belum meningkat dibanding catatan sebelumnya.',
  },
};

export default function DashboardOrtu() {
  const chartData = {
    labels: DASHBOARD_DATA.grafikBerat.labels,
    datasets: [
      {
        label: 'Berat Badan (kg)',
        data: DASHBOARD_DATA.grafikBerat.values,
        borderColor: '#F3831E',
        backgroundColor: '#F3831E',
        borderWidth: 2.5,
        tension: 0,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        pointBackgroundColor: '#F3831E',
        pointBorderColor: '#F3831E',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1D3B58',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toString().replace('.', ',')} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#334155',
          font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" },
          padding: 8,
        },
      },
      y: {
        min: 9,
        max: 12,
        border: { display: false },
        grid: {
          color: '#7B93AC',
          lineWidth: 0.9,
        },
        ticks: {
          stepSize: 1,
          color: '#334155',
          font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" },
          padding: 12,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Sapaan */}
        <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
          Halo, {DASHBOARD_DATA.namaOrangTua}
        </h1>

        {/* BARIS 1: Kartu Profil Anak (Kiri) & Kunjungan Berikutnya (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-stretch">
          {/* Kartu Biru: Identitas & Usia Anak */}
          <section className="relative lg:col-span-7 bg-[#2E5780] rounded-[24px] p-7 sm:p-8 text-white overflow-hidden shadow-[0_6px_24px_rgba(46,87,128,0.16)] flex flex-col justify-between min-h-[220px]">
            {/* Dekorasi Cincin Lengkungan Transparan */}
            <div
              aria-hidden="true"
              className="absolute -bottom-24 right-6 w-60 h-60 rounded-full border-[26px] border-white/[0.07] pointer-events-none"
            />

            {/* Nama Anak & Nama Posyandu */}
            <div className="relative z-10 flex items-center justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {DASHBOARD_DATA.anak.nama}
              </h2>
              <span className="text-xs sm:text-[13px] font-medium text-white/90">
                {DASHBOARD_DATA.anak.posyandu}
              </span>
            </div>

            {/* Highlight Usia */}
            <p className="relative z-10 text-3xl sm:text-[38px] font-bold tracking-tight leading-tight my-4">
              {DASHBOARD_DATA.anak.usiaTeks}
            </p>

            {/* Tombol Pintasan Profil & Buku KIA */}
            <div className="relative z-10 flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/ortu/profil-anak"
                className="bg-[#F3831E] hover:bg-[#e07414] text-white text-xs sm:text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Lihat Profil Anak
              </Link>
              <Link
                href="/ortu/buku-kia"
                className="bg-white hover:bg-slate-100 text-[#2E5780] text-xs sm:text-[13px] font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Buku Pendamping
              </Link>
            </div>
          </section>

          {/* Kartu Putih: Kunjungan Berikutnya */}
          <section className="lg:col-span-5 bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-[19px] font-bold text-[#2E5780]">
                Kunjungan Berikutnya
              </h2>

              <div className="mt-3">
                <span className="inline-block bg-[#2E5780] text-white text-sm sm:text-base font-semibold px-4 py-1 rounded-full">
                  {DASHBOARD_DATA.kunjunganBerikutnya.tanggal}
                </span>
              </div>

              <p className="text-base sm:text-lg font-bold italic text-[#F3831E] mt-3">
                {DASHBOARD_DATA.kunjunganBerikutnya.waktu}
              </p>
            </div>

            <div className="mt-3 text-sm sm:text-[15px] font-bold text-[#2E5780] leading-snug">
              <p>{DASHBOARD_DATA.kunjunganBerikutnya.tempat}</p>
              <p>{DASHBOARD_DATA.kunjunganBerikutnya.posyandu}</p>
            </div>

            {/* Tombol Pintasan ke Checklist Kesiapan */}
            <Link
                href="/ortu/panduan-kunjungan"
                className="mt-5 w-full bg-[#F3831E] hover:bg-[#e07414] text-white text-xs sm:text-[13px] font-semibold py-2.5 px-5 rounded-full flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Siapkan kunjungan</span>
                <span aria-hidden="true">→</span>
              </Link>
          </section>
        </div>

        {/* BARIS 2: 3 Kartu Statistik Pengukuran */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          {/* Kartu Berat Badan */}
          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-slate-600">
              Berat badan terakhir
            </p>
            <p className="text-2xl sm:text-[26px] font-bold text-[#F3831E] mt-1.5">
              {DASHBOARD_DATA.ringkasan.beratBadan}
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {DASHBOARD_DATA.ringkasan.tanggalUkur}
            </p>
          </div>

          {/* Kartu Panjang Badan */}
          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-slate-600">
              Panjang badan
            </p>
            <p className="text-2xl sm:text-[26px] font-bold text-[#F3831E] mt-1.5">
              {DASHBOARD_DATA.ringkasan.panjangBadan}
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {DASHBOARD_DATA.ringkasan.metodeUkur}
            </p>
          </div>

          {/* Kartu Kunjungan Tercatat */}
          <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-slate-600">
              Kunjungan tercatat
            </p>
            <p className="text-2xl sm:text-[26px] font-bold text-[#F3831E] mt-1.5">
              {DASHBOARD_DATA.ringkasan.totalKunjungan}
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {DASHBOARD_DATA.ringkasan.periodeKunjungan}
            </p>
          </div>
        </div>

        {/* BARIS 3: Grafik Pertumbuhan (Kiri) & Kartu Tindak Lanjut/Pengingat (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
          {/* Kolom Kiri: Grafik Perjalanan Pertumbuhan */}
          <section className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2E5780] tracking-tight">
                Perjalanan pertumbuhan
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Berat badan (kg) • 6 pengukuran terakhir
              </p>

              {/* Canvas Line Chart */}
              <div className="h-48 sm:h-52 w-full mt-6">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/ortu/pertumbuhan"
                className="inline-block border border-[#2E5780] text-[#1D3B58] hover:bg-slate-50 text-xs font-semibold px-7 py-2.5 rounded-xl transition-colors"
              >
                Lihat detail pertumbuhan
              </Link>
            </div>
          </section>

          {/* Kolom Kanan: 2 Kartu Bertumpuk */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Kartu 1: Ada Hal yang Perlu Dicermati (Alur P07 Panduan Tindakan) */}
            <section className="flex-1 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
              <h2 className="text-lg sm:text-[19px] font-bold text-[#2E5780]">
                Ada Hal yang Perlu dicermati
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-[270px]">
                {DASHBOARD_DATA.perluDicermati.pesan}
              </p>
              <Link
                href="/ortu/panduan-tindakan"
                className="mt-4 inline-block border border-[#2E5780] text-[#1D3B58] hover:bg-slate-50 text-xs font-semibold px-8 py-2.5 rounded-xl transition-colors"
              >
                Lihat langkah berikutnya
              </Link>
            </section>

            {/* Kartu 2: Pengingat untuk Keluarga (Alur P11 Notifikasi & Pengingat) */}
            <section className="flex-1 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
              <h2 className="text-lg sm:text-[19px] font-bold text-[#2E5780]">
                Pengingat untuk Keluarga
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-[270px]">
                {DASHBOARD_DATA.perluDicermati.pesan}
              </p>
              <Link
                href="/ortu/pengingat"
                className="mt-4 inline-block border border-[#2E5780] text-[#1D3B58] hover:bg-slate-50 text-xs font-semibold px-8 py-2.5 rounded-xl transition-colors"
              >
                Lihat langkah berikutnya
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}