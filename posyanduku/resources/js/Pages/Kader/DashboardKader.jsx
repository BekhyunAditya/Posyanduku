import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import SidebarKader from '@/Components/layout/SidebarKader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const MONTHLY_STATS = {
  'November 2026': {
    totalBalita: 128,
    sudahDikunjungi: 86,
    perluPendampingan: 8,
    catatanPelayanan: 5,
  },
  'Oktober 2026': {
    totalBalita: 125,
    sudahDikunjungi: 102,
    perluPendampingan: 6,
    catatanPelayanan: 9,
  },
  'September 2026': {
    totalBalita: 121,
    sudahDikunjungi: 94,
    perluPendampingan: 7,
    catatanPelayanan: 4,
  },
};

const CHART_DATASETS = {
  '3 bulan': {
    labels: ['Sep', '', 'Okt', '', 'Nov'],
    values: [56, 80, 100, 114, 126],
  },
  '6 bulan': {
    labels: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
    values: [68, 74, 82, 94, 102, 126],
  },
  '1 tahun': {
    labels: ['Jan', 'Mar', 'Mei', 'Jul', 'Sep', 'Nov'],
    values: [60, 72, 85, 90, 105, 126],
  },
};

const JADWAL_KEGIATAN = [
  {
    id: 1,
    tanggal: '20',
    bulan: 'Nov',
    judul: 'Posyandu Rutin',
    lokasi: 'Posyandu Melati 01',
    waktu: '08.00 - 11.00 WIB',
  },
  {
    id: 2,
    tanggal: '25',
    bulan: 'Nov',
    judul: 'Sosialisasi Gizi Anak',
    lokasi: 'Posyandu Melati 01',
    waktu: '09.00 WIB',
  },
];

const PRIORITAS_PENDAMPINGAN = [
  {
    id: 1,
    nama: 'Aruna Putri',
    usia: '18 bulan',
    kondisi: 'Berat badan kurang',
    tindakan: 'Monitoring rutin',
  },
  {
    id: 2,
    nama: 'Bima Pratama',
    usia: '24 bulan',
    kondisi: 'Belum hadir 2×',
    tindakan: 'Hubungi orang tua',
  },
  {
    id: 3,
    nama: 'Naila Safira',
    usia: '12 bulan',
    kondisi: 'Catatan imunisasi',
    tindakan: 'Cek jadwal imunisasi',
  },
];

const DashboardKader = () => {
  const [selectedMonth, setSelectedMonth] = useState('November 2026');
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('3 bulan');

  const currentStats = MONTHLY_STATS[selectedMonth];
  const currentChart = CHART_DATASETS[chartPeriod];

  const chartData = {
    labels: currentChart.labels,
    datasets: [
      {
        label: 'Jumlah Kunjungan Balita',
        data: currentChart.values,
        borderColor: '#2E5780',
        backgroundColor: '#2E5780',
        pointBackgroundColor: '#2E5780',
        pointBorderColor: '#2E5780',
        pointRadius: 4.5,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1D3B58',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} balita hadir`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 150,
        ticks: {
          stepSize: 50,
          color: '#334155',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 13,
            weight: '500',
          },
          padding: 10,
        },
        grid: {
          color: '#CBD5E1',
          drawTicks: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: '#334155',
          autoSkip: false,
          maxRotation: 0,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 13,
            weight: '500',
          },
          padding: 8,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const summaryCards = [
    {
      value: currentStats.totalBalita,
      label: 'Total balita terdaftar',
      bgClass: 'bg-[#B5D5F0]',
      circleClass: 'bg-black/10 text-[#1D3B58]',
      to: '/kader/data-balita',
    },
    {
      value: currentStats.sudahDikunjungi,
      label: 'Balita sudah dikunjungi',
      bgClass: 'bg-white',
      circleClass: 'bg-slate-200/70 text-[#1D3B58]',
      to: '/kader/pengukuran',
    },
    {
      value: currentStats.perluPendampingan,
      label: 'Balita perlu pendampingan',
      bgClass: 'bg-[#F3831E]',
      circleClass: 'bg-black/15 text-[#1D3B58]',
      to: '/kader/tindak-lanjut',
    },
    {
      value: currentStats.catatanPelayanan,
      label: 'Catatan pelayanan',
      bgClass: 'bg-white',
      circleClass: 'bg-slate-200/70 text-[#1D3B58]',
      to: '/kader/pelayanan',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      {/* Sidebar Kiri */}
      <SidebarKader />

      {/* Konten Utama Kanan */}
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <p className="text-[12.5px] font-medium text-[#334155]">
          Kader/Ringkasan
        </p>

        {/* Filter Bulan Kapsul */}
        <div className="relative inline-block mt-3">
          <button
            type="button"
            onClick={() => setMonthDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-3 bg-[#B5D5F0] hover:bg-[#a6cbed] text-[#1D3B58] text-[14.5px] font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            <span>{selectedMonth}</span>
            <ChevronDown
              className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
                monthDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {monthDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-[18px] shadow-[0_10px_28px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-30">
              {Object.keys(MONTHLY_STATS).map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(month);
                    setMonthDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                    selectedMonth === month
                      ? 'bg-[#C5E3FA]/60 text-[#1D3B58]'
                      : 'text-[#475569] hover:bg-slate-50'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sapaan Utama */}
        <div className="mt-5">
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
            Halo, Bu Siti!
          </h1>
          <p className="mt-1 text-[14px] text-[#475569]">
            Berikut ringkasan kegiatan posyandu bulan ini.
          </p>
        </div>

        {/* 4 Kartu Metrik Ringkasan */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {summaryCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.to}
              className={`${card.bgClass} rounded-[20px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-200 flex flex-col justify-between min-h-[124px] group`}
            >
              <p className="text-[32px] font-extrabold text-[#1D3B58] leading-none">
                {card.value}
              </p>

              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="text-[13.5px] font-medium text-[#1D3B58] leading-snug max-w-[130px]">
                  {card.label}
                </p>
                <span
                  className={`w-7 h-7 rounded-full ${card.circleClass} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5`}
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* Baris Tengah: Grafik Tren Kunjungan & Jadwal Kegiatan */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Grafik Tren Kunjungan Balita */}
          <div className="lg:col-span-8 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58]">
                Tren Kunjungan Balita
              </h2>

              {/* Filter Periode Grafik */}
              <div className="flex items-center gap-2">
                {['3 bulan', '6 bulan', '1 tahun'].map((period) => {
                  const isActive = chartPeriod === period;
                  return (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setChartPeriod(period)}
                      className={`px-3.5 py-1 rounded-full text-[11.5px] font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2E5780] text-white shadow-xs'
                          : 'bg-white text-[#2E5780] border border-[#2E5780]/45 hover:bg-[#C5E3FA]/30'
                      }`}
                    >
                      {period}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-[195px] w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Kartu Jadwal Kegiatan */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-4">
                Jadwal Kegiatan
              </h2>

              <div className="space-y-3">
                {JADWAL_KEGIATAN.map((item) => (
                  <div key={item.id} className="flex items-stretch gap-2.5">
                    {/* Lencana Tanggal */}
                    <div className="w-[62px] rounded-[14px] bg-[#B5D5F0] py-2.5 flex flex-col items-center justify-center shrink-0 text-[#1D3B58]">
                      <span className="text-[20px] font-extrabold leading-none">
                        {item.tanggal}
                      </span>
                      <span className="mt-1 text-[13.5px] font-medium leading-none">
                        {item.bulan}
                      </span>
                    </div>

                    {/* Detail Kegiatan */}
                    <div className="flex-1 rounded-[14px] bg-[#EBF3FA] px-3.5 py-2.5 flex flex-col justify-center">
                      <p className="text-[13px] font-bold text-[#1D3B58] leading-snug">
                        {item.judul}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#475569] leading-tight">
                        {item.lokasi}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#475569] leading-tight">
                        {item.waktu}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/kader/jadwal-kegiatan"
              className="mt-5 w-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold py-3 rounded-full inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Bagian Bawah: Tabel Prioritas Pendampingan */}
        <section className="mt-6 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-4">
            Prioritas Pendampingan
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left border-collapse">
              <thead>
                <tr className="bg-[#E3EEF8] text-[#1D3B58] text-[13px] font-bold">
                  <th className="py-3 px-4 rounded-l-[10px]">Nama Anak</th>
                  <th className="py-3 px-4 text-center">Usia</th>
                  <th className="py-3 px-4 text-center">Kondisi</th>
                  <th className="py-3 px-4 text-center rounded-r-[10px]">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-[13.5px] text-[#1E293B]">
                {PRIORITAS_PENDAMPINGAN.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.visit('/kader/tindak-lanjut')}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-medium">{row.nama}</td>
                    <td className="py-3.5 px-4 text-center">{row.usia}</td>
                    <td className="py-3.5 px-4 text-center">{row.kondisi}</td>
                    <td className="py-3.5 px-4 text-center">{row.tindakan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardKader;