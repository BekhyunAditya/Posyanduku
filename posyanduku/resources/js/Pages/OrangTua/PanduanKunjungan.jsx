import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Users, ClipboardCheck, Shield, Check } from 'lucide-react';
import NavbarOrtu from '@/Components/layout/NavbarOrtu';

const VISIT_PURPOSES = [
  {
    id: 'penimbangan',
    title: 'Penimbangan dan pelayanan balita',
    description: '',
    icon: Users,
    kegiatan: {
      tanggal: '20 November 2026',
      judul: 'Penimbangan & pelayanan balita',
      waktu: '08:00 – 11:00 WIB',
      lokasi: 'Balai RW 03 Posyandu Melati 01',
    },
    checklist: [
      { id: 'step-1', label: 'Periksa jadwal dan lokasi posyandu' },
      { id: 'step-2', label: 'Siapkan Buku KIA dan keperluan anak' },
      { id: 'step-3', label: 'Datang untuk pengukuran atau pelayanan' },
      { id: 'step-4', label: 'Lihat hasil dan arahan tindak lanjut' },
    ],
  },
  {
    id: 'imunisasi',
    title: 'Kunjungan 2',
    description: 'Catat pengukuran dan kelola kegiatan posyandu.',
    icon: ClipboardCheck,
    kegiatan: {
      tanggal: '27 November 2026',
      judul: 'Layanan imunisasi & vitamin balita',
      waktu: '08:30 – 11:00 WIB',
      lokasi: 'Balai RW 03 Posyandu Melati 01',
    },
    checklist: [
      { id: 'step-1', label: 'Periksa jadwal vaksin anak sesuai usia' },
      { id: 'step-2', label: 'Bawa Buku KIA & pastikan kondisi anak sehat' },
      { id: 'step-3', label: 'Lakukan pencatatan & pemberian imunisasi' },
      { id: 'step-4', label: 'Pantau kondisi anak dan catat jadwal berikutnya' },
    ],
  },
  {
    id: 'konsultasi',
    title: 'Kunjungan 3',
    description: 'Kelola akun, data posyandu, dan artikel.',
    icon: Shield,
    kegiatan: {
      tanggal: '04 Desember 2026',
      judul: 'Konsultasi gizi & penyuluhan MPASI',
      waktu: '09:00 – 11:30 WIB',
      lokasi: 'Balai RW 03 Posyandu Melati 01',
    },
    checklist: [
      { id: 'step-1', label: 'Tinjau grafik berat & panjang badan terakhir' },
      { id: 'step-2', label: 'Catat pola makan anak dan pertanyaan konsultasi' },
      { id: 'step-3', label: 'Diskusikan hasil pengukuran bersama kader' },
      { id: 'step-4', label: 'Terapkan panduan nutrisi sesuai arahan' },
    ],
  },
];

const STORAGE_KEY = 'posyanduku_checklist_progress';

export default function PanduanKunjungan() {
  const [selectedPurposeId, setSelectedPurposeId] = useState('penimbangan');
  const [checkedMap, setCheckedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedMap));
    } catch {
      // Abaikan jika storage penuh/diblokir
    }
  }, [checkedMap]);

  const activePurpose =
    VISIT_PURPOSES.find((item) => item.id === selectedPurposeId) || VISIT_PURPOSES[0];

  const activeCheckedIds = checkedMap[activePurpose.id] || [];
  const totalSteps = activePurpose.checklist.length;
  const completedSteps = activeCheckedIds.length;

  const toggleStep = (stepId) => {
    setCheckedMap((prev) => {
      const currentList = prev[activePurpose.id] || [];
      const exists = currentList.includes(stepId);
      const updatedList = exists
        ? currentList.filter((id) => id !== stepId)
        : [...currentList, stepId];

      return {
        ...prev,
        [activePurpose.id]: updatedList,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

          {/* Kolom Kiri: Kartu Checklist Kesiapan */}
          <section className="lg:col-span-8 bg-white rounded-[28px] p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
              Checklist Kesiapan
            </h1>

            {/* Sub-bagian 1: Pilih Tujuan Kunjungan */}
            <h2 className="text-base sm:text-[18px] font-bold text-[#1E293B] mt-5">
              Pilih tujuan kunjungan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
              {VISIT_PURPOSES.map((purpose) => {
                const Icon = purpose.icon;
                const isSelected = purpose.id === selectedPurposeId;

                return (
                  <button
                    key={purpose.id}
                    type="button"
                    onClick={() => setSelectedPurposeId(purpose.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[118px] ${
                      isSelected
                        ? 'border-[#F39C4F] bg-[#FFF9F2] ring-1 ring-[#F39C4F]'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                        isSelected
                          ? 'bg-[#F39C4F] text-white'
                          : 'bg-[#E6EFF8] text-[#2E5780]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#1D3B58] leading-snug">
                        {purpose.title}
                      </h3>
                      {purpose.description && (
                        <p className="text-[10.5px] leading-relaxed text-slate-500 mt-1">
                          {purpose.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sub-bagian 2: Kesiapan Kunjungan & Progres */}
            <h2 className="text-base sm:text-[18px] font-bold text-[#1E293B] mt-6">
              Kesiapan kunjungan
            </h2>

            <div className="mt-2.5 flex items-center justify-between gap-3">
              <span className="inline-block bg-[#BBDDF7] text-[#1D3B58] text-xs font-semibold px-3.5 py-1 rounded-full">
                {completedSteps} / {totalSteps} selesai
              </span>

              {completedSteps === totalSteps && (
                <Link
                  href="/ortu/buku-kia"
                  className="text-xs font-bold text-[#2E5780] hover:underline"
                >
                  Lihat Buku KIA Pendamping →
                </Link>
              )}
            </div>

            {/* Daftar Langkah Checklist Interaktif */}
            <ul className="mt-4 space-y-3">
              {activePurpose.checklist.map((step) => {
                const isChecked = activeCheckedIds.includes(step.id);

                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="w-full text-left bg-[#F7F5F0] hover:bg-[#F1EEE7] rounded-xl px-4 py-3.5 flex items-center gap-3.5 transition-colors cursor-pointer"
                    >
                      {/* Indikator Lingkaran */}
                      <span
                        className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#2E5780] border-[#2E5780] text-white'
                            : 'border-[#2E5780] bg-transparent'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>

                      <span
                        className={`text-xs sm:text-[13px] transition-colors ${
                          isChecked
                            ? 'text-[#1D3B58]/70 line-through font-medium'
                            : 'text-[#1E293B] font-medium'
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Kolom Kanan: Kartu Ringkasan Kegiatan Posyandu */}
          <aside className="lg:col-span-4 bg-white rounded-[28px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl sm:text-[22px] font-bold text-[#2E5780] tracking-tight">
              Kegiatan
            </h2>

            <p className="text-lg sm:text-[21px] font-bold text-[#F3831E] mt-3">
              {activePurpose.kegiatan.tanggal}
            </p>

            <h3 className="text-lg sm:text-[20px] font-bold text-[#2E5780] leading-snug mt-3">
              {activePurpose.kegiatan.judul}
            </h3>

            <p className="text-base sm:text-[18px] font-bold italic text-[#2E5780] mt-3.5">
              {activePurpose.kegiatan.waktu}
            </p>

            <p className="text-xs sm:text-[13px] font-medium text-[#2E5780] mt-3">
              {activePurpose.kegiatan.lokasi}
            </p>

            <Link
              href="/ortu/jadwal-posyandu"
              className="mt-5 w-full block text-center bg-[#F3831E] hover:bg-[#e07414] text-white text-xs sm:text-[13px] font-semibold py-2.5 px-6 rounded-full transition-colors"
            >
              Lihat jadwal lengkap
            </Link>
          </aside>

        </div>
      </main>
    </div>
  );
}