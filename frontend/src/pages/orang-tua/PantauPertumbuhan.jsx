import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import NavbarOrtu from '../../components/layout/NavbarOrtu';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

// Dummy data sementara sebelum terhubung ke API Laravel (GET /api/ortu/balita/:id/pertumbuhan)
const GROWTH_DATA = {
  namaAnak: 'Aruna Putri',
  beratBadan: {
    judul: 'Berat badan menurut waktu',
    satuanLabel: 'merupakan kg',
    unit: 'kg',
    min: 9,
    max: 12,
    step: 1,
    showPointLabels: false,
    labels: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
    values: [9.2, 9.5, 9.8, 10.0, 10.2, 10.2],
  },
  panjangTinggi: {
    judul: 'Panjang/tinggi badan menurut waktu',
    satuanLabel: 'Satuan cm • panjang badan diukur berbaring',
    unit: 'cm',
    min: 78,
    max: 81,
    step: 1,
    showPointLabels: true,
    labels: ['Sep', 'Okt', 'Nov'],
    values: [79.0, 79.8, 80.5],
  },
  riwayat: [
    {
      id: 1,
      tanggal: '10 Nov 2026',
      usia: '17 bln 26 hari',
      berat: '10,2 kg',
      panjang: '80,5 cm',
      caraPengukuran: 'Berbaring',
      pencatat: 'Siti R.',
    },
    {
      id: 2,
      tanggal: '10 Okt 2026',
      usia: '16 bln 25 hari',
      berat: '10,2 kg',
      panjang: '79,8 cm',
      caraPengukuran: 'Berbaring',
      pencatat: 'Siti R.',
    },
    {
      id: 3,
      tanggal: '10 Sep 2026',
      usia: '15 bln 26 hari',
      berat: '10,0 kg',
      panjang: '79,0 cm',
      caraPengukuran: 'Berbaring',
      pencatat: 'Siti R.',
    },
  ],
};

// Plugin khusus untuk menampilkan teks nilai di atas titik grafik Panjang/Tinggi
const pointLabelPlugin = {
  id: 'pointLabelPlugin',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    const dataset = data.datasets[0];
    if (!dataset?.showPointLabels) return;

    const meta = chart.getDatasetMeta(0);
    ctx.save();
    ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = '#1D3B58';

    meta.data.forEach((point, index) => {
      const rawValue = dataset.data[index];
      const formattedText = `${rawValue.toFixed(1).replace('.', ',')} cm`;

      if (index === 0) {
        ctx.textAlign = 'left';
        ctx.fillText(formattedText, point.x + 8, point.y - 10);
      } else if (index === meta.data.length - 1) {
        ctx.textAlign = 'right';
        ctx.fillText(formattedText, point.x - 8, point.y - 10);
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(formattedText, point.x, point.y - 10);
      }
    });

    ctx.restore();
  },
};

export default function PantauPertumbuhan() {
  const [activeMetric, setActiveMetric] = useState('tinggi'); // 'berat' | 'tinggi'

  const currentSeries =
    activeMetric === 'berat' ? GROWTH_DATA.beratBadan : GROWTH_DATA.panjangTinggi;

  const chartData = {
    labels: currentSeries.labels,
    datasets: [
      {
        label: activeMetric === 'berat' ? 'Berat Badan' : 'Panjang / Tinggi',
        data: currentSeries.values,
        showPointLabels: currentSeries.showPointLabels,
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
    layout: {
      padding: {
        top: 16,
        left: 6,
        right: 12,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1D3B58',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) =>
            ` ${ctx.parsed.y.toFixed(1).replace('.', ',')} ${currentSeries.unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#1E293B',
          font: {
            size: 11,
            weight: '500',
            family: "'Plus Jakarta Sans', sans-serif",
          },
          padding: 14,
        },
      },
      y: {
        min: currentSeries.min,
        max: currentSeries.max,
        border: { display: false },
        grid: {
          color: '#5C7B99',
          lineWidth: 1,
        },
        ticks: {
          stepSize: currentSeries.step,
          color: '#1E293B',
          font: {
            size: 11,
            weight: '500',
            family: "'Plus Jakarta Sans', sans-serif",
          },
          padding: 20,
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
        {/* Judul Halaman */}
        <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
          Detail pertumbuhan {GROWTH_DATA.namaAnak}
        </h1>

        {/* Tab Pilihan Metrik (Berat Badan / Panjang/Tinggi) */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => setActiveMetric('berat')}
            className={`px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
              activeMetric === 'berat'
                ? 'bg-[#2E5780] text-white shadow-[0_2px_10px_rgba(46,87,128,0.2)]'
                : 'bg-white text-[#2E5780] shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:bg-slate-50'
            }`}
          >
            Berat Badan
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('tinggi')}
            className={`px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
              activeMetric === 'tinggi'
                ? 'bg-[#2E5780] text-white shadow-[0_2px_10px_rgba(46,87,128,0.2)]'
                : 'bg-white text-[#2E5780] shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:bg-slate-50'
            }`}
          >
            Panjang/Tinggi
          </button>
        </div>

        {/* Kartu Grafik Pertumbuhan */}
        <section className="bg-white rounded-[28px] p-7 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-6">
          <h2 className="text-xl sm:text-[26px] font-bold text-[#2E5780] tracking-tight">
            {currentSeries.judul}
          </h2>

          <div className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-[#1E293B] mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E293B]" />
            <span>{currentSeries.satuanLabel}</span>
          </div>

          {/* Area Grafik */}
          <div className="h-60 sm:h-72 w-full mt-7">
            <Line
              key={activeMetric}
              data={chartData}
              options={chartOptions}
              plugins={[pointLabelPlugin]}
            />
          </div>
        </section>

        {/* Kartu Tabel Riwayat Pengukuran */}
        <section className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-6">
          <h2 className="text-lg sm:text-[20px] font-bold text-[#2E5780] tracking-tight">
            {activeMetric === 'berat' ? 'Riwayat pengukuran' : 'Riwayat panjang badan'}
          </h2>

          {GROWTH_DATA.riwayat.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500 mt-4">
              Belum ada data pengukuran; tunggu catatan kader posyandu.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              {activeMetric === 'berat' ? (
                /* Tabel Mode Berat Badan (5 Kolom) */
                <table className="w-full min-w-[560px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F5F0] text-[#1E293B] text-xs font-bold">
                      <th className="py-3 px-4 rounded-l-xl">Tanggal</th>
                      <th className="py-3 px-4">Usia</th>
                      <th className="py-3 px-4">Berat</th>
                      <th className="py-3 px-4">Panjang / tinggi</th>
                      <th className="py-3 px-4 rounded-r-xl">Pencatat</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-[#1E293B]">
                    {GROWTH_DATA.riwayat.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#5C7B99]/75 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium">{item.tanggal}</td>
                        <td className="py-3.5 px-4">{item.usia}</td>
                        <td className="py-3.5 px-4">{item.berat}</td>
                        <td className="py-3.5 px-4">
                          {item.panjang} · {item.caraPengukuran.toLowerCase()}
                        </td>
                        <td className="py-3.5 px-4">{item.pencatat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Tabel Mode Panjang/Tinggi Badan (4 Kolom) */
                <table className="w-full min-w-[520px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F5F0] text-[#1E293B] text-xs font-bold">
                      <th className="py-3 px-4 rounded-l-xl">Tanggal</th>
                      <th className="py-3 px-4">Usia</th>
                      <th className="py-3 px-4">Panjang</th>
                      <th className="py-3 px-4 rounded-r-xl">Cara pengukuran</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-[#1E293B]">
                    {GROWTH_DATA.riwayat.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#5C7B99]/75 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium">{item.tanggal}</td>
                        <td className="py-3.5 px-4">{item.usia}</td>
                        <td className="py-3.5 px-4">{item.panjang}</td>
                        <td className="py-3.5 px-4">{item.caraPengukuran}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}