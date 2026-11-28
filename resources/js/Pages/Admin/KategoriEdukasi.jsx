import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';
import { KATEGORI_STORAGE_KEY, INITIAL_CATEGORIES } from './KelolaEdukasi';

export const KATEGORI_DETAIL_STORAGE_KEY = 'posyanduku_admin_category_details';

export const INITIAL_CATEGORY_DETAILS = [
    {
        id: 'asi',
        nama: 'ASI',
        artikel: 6,
        sasaran: 'Keluarga dengan bayi',
        status: 'Aktif',
    },
    {
        id: 'mpasi',
        nama: 'MPASI',
        artikel: 8,
        sasaran: '6–24 bulan',
        status: 'Aktif',
    },
    {
        id: 'gizi-terjangkau',
        nama: 'Gizi terjangkau',
        artikel: 4,
        sasaran: 'Keluarga balita',
        status: 'Aktif',
    },
    {
        id: 'imunisasi',
        nama: 'Imunisasi',
        artikel: 4,
        sasaran: 'Semua kelompok usia',
        status: 'Aktif',
    },
    {
        id: 'pertumbuhan',
        nama: 'Pertumbuhan',
        artikel: 2,
        sasaran: '0–59 bulan',
        status: 'Aktif',
    },
];

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const KategoriEdukasi = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState(INITIAL_CATEGORY_DETAILS);
    const [namaKategori, setNamaKategori] = useState('');
    const [sasaran, setSasaran] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(KATEGORI_DETAIL_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCategories(parsed);
                }
            } else {
                localStorage.setItem(
                    KATEGORI_DETAIL_STORAGE_KEY,
                    JSON.stringify(INITIAL_CATEGORY_DETAILS)
                );
            }
        } catch {
            setCategories(INITIAL_CATEGORY_DETAILS);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanNama = namaKategori.trim();
        const cleanSasaran = sasaran.trim() || 'Semua keluarga';

        if (!cleanNama) return;

        try {
            const existingRaw = localStorage.getItem(KATEGORI_DETAIL_STORAGE_KEY);
            const existingList = existingRaw
                ? JSON.parse(existingRaw)
                : INITIAL_CATEGORY_DETAILS;

            const alreadyExists = existingList.some(
                (item) => item.nama.toLowerCase() === cleanNama.toLowerCase()
            );

            if (!alreadyExists) {
                const newEntry = {
                    id: `${cleanNama.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
                    nama: cleanNama,
                    artikel: 0,
                    sasaran: cleanSasaran,
                    status: 'Aktif',
                };

                localStorage.setItem(
                    KATEGORI_DETAIL_STORAGE_KEY,
                    JSON.stringify([...existingList, newEntry])
                );
            }

            // Sinkronkan ke daftar kategori pada editor artikel (FormArtikel)
            const articleCatsRaw = localStorage.getItem(KATEGORI_STORAGE_KEY);
            const articleCats = articleCatsRaw
                ? JSON.parse(articleCatsRaw)
                : INITIAL_CATEGORIES;

            if (
                !articleCats.some(
                    (cat) => cat.toLowerCase() === cleanNama.toLowerCase()
                )
            ) {
                localStorage.setItem(
                    KATEGORI_STORAGE_KEY,
                    JSON.stringify([...articleCats, cleanNama])
                );
            }
        } catch {
            // Abaikan error penyimpanan lokal jika dibatasi browser
        }

        router.visit('/admin/kategori-edukasi/konfirmasi');
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Kategori Edukasi" />

            <SidebarAdmin activeMenu="kategori-edukasi" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Kategori edukasi
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
                        Susun materi agar mudah dijelajahi
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Kelompokkan artikel berdasarkan topik dan usia.
                    </p>
                </header>

                {/* Tombol Pill Atas: Kelola Kategori (Aktif Biru Tua) & + Tulis artikel (Putih) */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/kategori-edukasi')}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
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

                {/* Kartu Tabel Kategori Aktif */}
                <section className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">
                        Kategori aktif
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[580px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#FDEBD3] text-[#1E293B] text-xs font-semibold">
                                    <th className="py-3 px-4 rounded-l-[10px]">
                                        Kategori
                                    </th>
                                    <th className="py-3 px-4">Artikel</th>
                                    <th className="py-3 px-4">Sasaran</th>
                                    <th className="py-3 px-4 rounded-r-[10px]">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] text-[#334155]">
                                {categories.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-[#7B9EC0]/60 hover:bg-[#F8FAFC] transition-colors"
                                    >
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {item.nama}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {item.artikel}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {item.sasaran}
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {item.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Kartu Form Tambah Kategori */}
                <section className="bg-white rounded-[24px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-5">
                        Tambah kategori
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            {/* Input Nama Kategori */}
                            <div className="sm:col-span-7">
                                <label
                                    htmlFor="namaKategori"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Nama kategori
                                </label>
                                <input
                                    id="namaKategori"
                                    type="text"
                                    required
                                    value={namaKategori}
                                    onChange={(e) =>
                                        setNamaKategori(e.target.value)
                                    }
                                    placeholder="Panduan kunjungan"
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>

                            {/* Input Sasaran */}
                            <div className="sm:col-span-5">
                                <label
                                    htmlFor="sasaran"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Sasaran
                                </label>
                                <input
                                    id="sasaran"
                                    type="text"
                                    required
                                    value={sasaran}
                                    onChange={(e) => setSasaran(e.target.value)}
                                    placeholder="Semua keluarga"
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center px-10 py-3 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                            >
                                Simpan kategori
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default KategoriEdukasi;