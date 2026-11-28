import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';

export const ARTIKEL_STORAGE_KEY = 'posyanduku_admin_articles';
export const KATEGORI_STORAGE_KEY = 'posyanduku_admin_categories';

export const INITIAL_CATEGORIES = [
    'ASI',
    'MPASI',
    'Gizi terjangkau',
    'Imunisasi',
    'Pertumbuhan',
    'Panduan kunjungan',
];

export const INITIAL_ARTICLES = [
    {
        id: 'catatan-kecil-sebelum-konsultasi',
        judul: 'Catatan kecil sebelum konsultasi',
        ringkasan:
            'Daftar hal penting yang perlu disiapkan orang tua sebelum berkonsultasi di Posyandu.',
        isiMateri:
            'Siapkan buku KIA, catatan keluhan harian anak, serta riwayat makan dan tidur dalam 3 hari terakhir agar kader dan tenaga kesehatan dapat memberikan pendampingan yang tepat.',
        sumberRujukan:
            'Buku KIA Kemenkes RI Edisi 2024, https://ayosehat.kemkes.go.id, diakses 10 Nov 2026',
        kategori: 'Panduan kunjungan',
        kelompokUsia: '0–59 bulan',
        peninjau: 'Tenaga kesehatan berwenang',
        status: 'Terbit',
        peninjauan: '15 Nov 2026',
    },
    {
        id: 'mengenal-kebutuhan-makan-anak',
        judul: 'Mengenal kebutuhan makan anak',
        ringkasan:
            'Ringkasan pendek yang membantu orang tua memahami isi materi.',
        isiMateri:
            'Tulis materi edukasi yang telah dikurasi di sini.\n\nGunakan paragraf pendek dan langkah yang mudah dipahami.',
        sumberRujukan: '',
        kategori: 'MPASI',
        kelompokUsia: '12–24 bulan',
        peninjau: 'Tenaga kesehatan berwenang',
        status: 'Draft',
        peninjauan: 'Sumber perlu dilengkapi',
    },
    {
        id: 'siapkan-riwayat-imunisasi',
        judul: 'Siapkan riwayat imunisasi',
        ringkasan:
            'Panduan mengecek kelengkapan jadwal imunisasi dasar dan lanjutan balita.',
        isiMateri:
            'Periksa tanggal pemberian imunisasi sebelumnya pada lembar catatan imunisasi dan pastikan kondisi anak dalam keadaan bugar sebelum jadwal kunjungan berikutnya.',
        sumberRujukan:
            'Petunjuk Teknis Imunisasi Rutin Kemenkes RI, https://sehatnegeriku.kemkes.go.id, diakses 12 Nov 2026',
        kategori: 'Imunisasi',
        kelompokUsia: '0–12 bulan',
        peninjau: 'Tenaga kesehatan berwenang',
        status: 'Dalam tinjauan',
        peninjauan: 'Menunggu peninjau',
    },
    {
        id: 'ide-bahan-pangan-keluarga',
        judul: 'Ide bahan pangan keluarga',
        ringkasan:
            'Pilihan bahan makanan bergizi seimbang yang mudah dijangkau di sekitar rumah.',
        isiMateri:
            'Kombinasikan sumber protein hewani lokal seperti telur, ikan kembung, dan hati ayam dengan sayuran hijau serta karbohidrat harian keluarga.',
        sumberRujukan: '',
        kategori: 'Gizi terjangkau',
        kelompokUsia: '6–24 bulan',
        peninjau: 'Tenaga kesehatan berwenang',
        status: 'Draft',
        peninjauan: 'Belum diajukan',
    },
];

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const KelolaEdukasi = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [articles, setArticles] = useState(INITIAL_ARTICLES);
    const dropdownRef = useRef(null);

    useEffect(() => {
        try {
            const savedArticles = localStorage.getItem(ARTIKEL_STORAGE_KEY);
            if (savedArticles) {
                const parsed = JSON.parse(savedArticles);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setArticles(parsed);
                }
            } else {
                localStorage.setItem(
                    ARTIKEL_STORAGE_KEY,
                    JSON.stringify(INITIAL_ARTICLES)
                );
            }
        } catch {
            setArticles(INITIAL_ARTICLES);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Artikel & Edukasi" />

            <SidebarAdmin activeMenu="edukasi" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Artikel &amp; edukasi
                </p>

                {/* Dropdown Filter Bulan */}
                <div className="relative inline-block mb-6" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="inline-flex items-center gap-2.5 bg-[#B5D5F0] hover:bg-[#A6CBEB] text-[#1D3B58] font-semibold text-sm sm:text-[15px] px-5 py-2.5 rounded-full transition-colors cursor-pointer shadow-2xs"
                    >
                        <span>{selectedMonth}</span>
                        <ChevronDown
                            className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
                                dropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-slate-100 py-1.5 z-20">
                            {MONTH_OPTIONS.map((month) => (
                                <button
                                    key={month}
                                    type="button"
                                    onClick={() => {
                                        setSelectedMonth(month);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                                        selectedMonth === month
                                            ? 'bg-[#E3EEF8] text-[#1D3B58] font-semibold'
                                            : 'text-[#334155] hover:bg-slate-50'
                                    }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Header Judul */}
                <header className="mb-5">
                    <h1 className="text-3xl sm:text-[36px] font-bold text-[#1E293B] tracking-tight leading-tight">
                        Pengetahuan yang mudah ditemukan.
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Kelola artikel, sumber, dan status peninjauan sebelum publikasi.
                    </p>
                </header>

                {/* Tombol Pill Navigasi (Kelola Kategori & + Tulis artikel) */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/kategori-edukasi')}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#1D3B58] text-[13px] font-semibold transition-colors cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/70"
                    >
                        Kelola Kategori
                    </button>

                    <button
                        type="button"
                        onClick={() => router.visit('/admin/edukasi/tulis')}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#1D3B58] text-[13px] font-semibold transition-colors cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/70"
                    >
                        + Tulis artikel
                    </button>
                </div>

                {/* Kartu Tabel Konten Edukasi */}
                <section className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">
                        Konten edukasi
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#FDEBD3] text-[#1E293B] text-xs font-semibold">
                                    <th className="py-3 px-4 rounded-l-[10px]">
                                        Judul
                                    </th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Peninjauan</th>
                                    <th className="py-3 px-4 rounded-r-[10px]">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] text-[#334155]">
                                {articles.map((article) => (
                                    <tr
                                        key={article.id}
                                        className="border-b border-[#7B9EC0]/60 hover:bg-[#F8FAFC] transition-colors"
                                    >
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {article.judul}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {article.kategori}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {article.status}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {article.peninjauan}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.visit(
                                                        `/admin/edukasi/sunting/${article.id}`
                                                    )
                                                }
                                                className="inline-flex items-center gap-1 text-[#1E293B] hover:text-[#2E5780] font-medium transition-colors cursor-pointer"
                                            >
                                                <span>Sunting</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
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

export default KelolaEdukasi;