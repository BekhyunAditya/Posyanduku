import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';
import {
    ARTIKEL_STORAGE_KEY,
    INITIAL_ARTICLES,
    KATEGORI_STORAGE_KEY,
    INITIAL_CATEGORIES,
} from './KelolaEdukasi';

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const KELOMPOK_USIA_OPTIONS = [
    '12–24 bulan',
    '0–6 bulan',
    '6–12 bulan',
    '6–24 bulan',
    '24–59 bulan',
    '0–59 bulan',
];

const FormArtikel = ({ slug = null }) => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const dropdownRef = useRef(null);

    const isEditMode = Boolean(slug);

    const [formData, setFormData] = useState({
        id: null,
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
    });

    useEffect(() => {
        try {
            const savedCats = localStorage.getItem(KATEGORI_STORAGE_KEY);
            if (savedCats) {
                const parsedCats = JSON.parse(savedCats);
                if (Array.isArray(parsedCats) && parsedCats.length > 0) {
                    setCategories(parsedCats);
                }
            }
        } catch {
            setCategories(INITIAL_CATEGORIES);
        }
    }, []);

    useEffect(() => {
        if (!isEditMode) {
            setFormData({
                id: null,
                judul: '',
                ringkasan: '',
                isiMateri: '',
                sumberRujukan: '',
                kategori: 'MPASI',
                kelompokUsia: '12–24 bulan',
                peninjau: 'Tenaga kesehatan berwenang',
                status: 'Draft',
            });
            return;
        }

        try {
            const savedRaw = localStorage.getItem(ARTIKEL_STORAGE_KEY);
            const list = savedRaw ? JSON.parse(savedRaw) : INITIAL_ARTICLES;
            const found = list.find((item) => item.id === slug);

            if (found) {
                setFormData({
                    id: found.id,
                    judul: found.judul,
                    ringkasan: found.ringkasan || '',
                    isiMateri: found.isiMateri || '',
                    sumberRujukan: found.sumberRujukan || '',
                    kategori: found.kategori || 'MPASI',
                    kelompokUsia: found.kelompokUsia || '12–24 bulan',
                    peninjau: found.peninjau || 'Tenaga kesehatan berwenang',
                    status: found.status || 'Draft',
                });
            }
        } catch {
            // Gunakan default state jika gagal membaca localStorage
        }
    }, [isEditMode, slug]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const persistArticle = (actionType) => {
        const isSubmitReview = actionType === 'tinjau';
        const nextStatus = isSubmitReview ? 'Dalam tinjauan' : 'Draft';
        const nextPeninjauan = isSubmitReview
            ? 'Menunggu peninjau'
            : formData.sumberRujukan.trim()
            ? 'Belum diajukan'
            : 'Sumber perlu dilengkapi';

        try {
            const existingRaw = localStorage.getItem(ARTIKEL_STORAGE_KEY);
            const existingList = existingRaw
                ? JSON.parse(existingRaw)
                : INITIAL_ARTICLES;

            const titleClean =
                formData.judul.trim() || 'Artikel Edukasi Baru';

            if (isEditMode && formData.id) {
                const updated = existingList.map((item) =>
                    item.id === formData.id
                        ? {
                              ...item,
                              judul: titleClean,
                              ringkasan: formData.ringkasan.trim(),
                              isiMateri: formData.isiMateri.trim(),
                              sumberRujukan: formData.sumberRujukan.trim(),
                              kategori: formData.kategori,
                              kelompokUsia: formData.kelompokUsia,
                              peninjau: formData.peninjau.trim(),
                              status: nextStatus,
                              peninjauan: nextPeninjauan,
                          }
                        : item
                );
                localStorage.setItem(
                    ARTIKEL_STORAGE_KEY,
                    JSON.stringify(updated)
                );
            } else {
                const generatedId = `${titleClean
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')}-${Date.now()}`;

                const newArticle = {
                    id: generatedId,
                    judul: titleClean,
                    ringkasan: formData.ringkasan.trim(),
                    isiMateri: formData.isiMateri.trim(),
                    sumberRujukan: formData.sumberRujukan.trim(),
                    kategori: formData.kategori,
                    kelompokUsia: formData.kelompokUsia,
                    peninjau:
                        formData.peninjau.trim() ||
                        'Tenaga kesehatan berwenang',
                    status: nextStatus,
                    peninjauan: nextPeninjauan,
                };

                localStorage.setItem(
                    ARTIKEL_STORAGE_KEY,
                    JSON.stringify([...existingList, newArticle])
                );
            }
        } catch {
            // Abaikan error penyimpanan lokal jika dibatasi browser
        }

        if (isSubmitReview) {
            router.visit('/admin/edukasi/konfirmasi/tinjau');
        } else {
            router.visit('/admin/edukasi/konfirmasi/draft');
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        persistArticle('tinjau');
    };

    const isPublished = formData.status === 'Terbit';

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Editor Artikel & Edukasi" />

            <SidebarAdmin activeMenu="edukasi" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Artikel &amp; edukasi/{isEditMode ? 'Sunting' : 'Tulis'}
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
                        Siapkan materi yang bisa dipercaya.
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Isi artikel, kelompok usia, sumber, dan peninjau sebelum
                        diajukan.
                    </p>
                </header>

                {/* Tombol Pill Atas: Kelola Kategori (Putih) & + Tulis artikel (Aktif Biru Tua) */}
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
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                        + Tulis artikel
                    </button>
                </div>

                {/* Grid 2 Kolom: Isi Artikel (Kiri) & Pengaturan Konten (Kanan) */}
                <form
                    onSubmit={handleFormSubmit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
                >
                    {/* Kolom Kiri: Kartu Putih Isi Artikel */}
                    <section className="lg:col-span-8 bg-white rounded-[24px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <h2 className="text-[18px] font-bold text-[#1E293B] mb-5">
                            Isi artikel
                        </h2>

                        <div className="space-y-4">
                            {/* Judul */}
                            <div>
                                <label
                                    htmlFor="judul"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Judul
                                </label>
                                <input
                                    id="judul"
                                    name="judul"
                                    type="text"
                                    required
                                    value={formData.judul}
                                    onChange={handleChange}
                                    placeholder="Mengenal kebutuhan makan anak"
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>

                            {/* Ringkasan */}
                            <div>
                                <label
                                    htmlFor="ringkasan"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Ringkasan
                                </label>
                                <input
                                    id="ringkasan"
                                    name="ringkasan"
                                    type="text"
                                    value={formData.ringkasan}
                                    onChange={handleChange}
                                    placeholder="Ringkasan pendek yang membantu orang tua memahami isi materi."
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>

                            {/* Isi materi */}
                            <div>
                                <label
                                    htmlFor="isiMateri"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Isi materi
                                </label>
                                <textarea
                                    id="isiMateri"
                                    name="isiMateri"
                                    rows={4}
                                    value={formData.isiMateri}
                                    onChange={handleChange}
                                    placeholder={
                                        'Tulis materi edukasi yang telah dikurasi di sini.\n\nGunakan paragraf pendek dan langkah yang mudah dipahami.'
                                    }
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0] leading-relaxed"
                                />
                            </div>

                            {/* Sumber rujukan */}
                            <div>
                                <label
                                    htmlFor="sumberRujukan"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Sumber rujukan
                                </label>
                                <input
                                    id="sumberRujukan"
                                    name="sumberRujukan"
                                    type="text"
                                    value={formData.sumberRujukan}
                                    onChange={handleChange}
                                    placeholder="Tambahkan judul panduan resmi, URL, dan tanggal akses."
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>

                            {/* Dua Tombol Aksi: Simpan draft & Ajukan peninjauan */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => persistArticle('draft')}
                                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-[12px] border border-[#2E5780] bg-white hover:bg-slate-50 text-[#1E293B] text-[12px] font-semibold transition-colors cursor-pointer"
                                >
                                    Simpan draft
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-10 py-2.5 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                                >
                                    Ajukan peninjauan
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Kolom Kanan: Kartu Biru Muda Pengaturan Konten */}
                    <aside className="lg:col-span-4 bg-[#B5D5F0] rounded-[24px] p-6 text-[#1E293B]">
                        <h2 className="text-[18px] font-bold text-[#1E293B] mb-5">
                            Pengaturan konten
                        </h2>

                        <div className="space-y-4">
                            {/* Kategori */}
                            <div>
                                <label
                                    htmlFor="kategori"
                                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                                >
                                    Kategori
                                </label>
                                <div className="relative">
                                    <select
                                        id="kategori"
                                        name="kategori"
                                        value={formData.kategori}
                                        onChange={handleChange}
                                        className="w-full appearance-none rounded-[14px] bg-white px-4 py-3 pr-9 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2E5780]"
                                    >
                                        {categories.map((kat) => (
                                            <option key={kat} value={kat}>
                                                {kat}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#334155]" />
                                </div>
                            </div>

                            {/* Kelompok usia */}
                            <div>
                                <label
                                    htmlFor="kelompokUsia"
                                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                                >
                                    Kelompok usia
                                </label>
                                <div className="relative">
                                    <select
                                        id="kelompokUsia"
                                        name="kelompokUsia"
                                        value={formData.kelompokUsia}
                                        onChange={handleChange}
                                        className="w-full appearance-none rounded-[14px] bg-white px-4 py-3 pr-9 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2E5780]"
                                    >
                                        {KELOMPOK_USIA_OPTIONS.map((usia) => (
                                            <option key={usia} value={usia}>
                                                {usia}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#334155]" />
                                </div>
                            </div>

                            {/* Peninjau */}
                            <div>
                                <label
                                    htmlFor="peninjau"
                                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                                >
                                    Peninjau
                                </label>
                                <input
                                    id="peninjau"
                                    name="peninjau"
                                    type="text"
                                    value={formData.peninjau}
                                    onChange={handleChange}
                                    className="w-full rounded-[14px] bg-white px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2E5780]"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                                >
                                    Status
                                </label>
                                <input
                                    id="status"
                                    name="status"
                                    type="text"
                                    readOnly
                                    value={formData.status}
                                    className="w-full rounded-[14px] bg-white px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none"
                                />
                            </div>

                            {/* Catatan & Badge Status Publikasi */}
                            <div className="pt-1">
                                <p className="text-[11px] text-[#1E293B]/90 leading-relaxed mb-3">
                                    Tombol terbit tersedia setelah sumber lengkap
                                    dan peninjauan disetujui.
                                </p>

                                <span className="inline-block bg-white text-[#1E293B] text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full shadow-2xs">
                                    {isPublished
                                        ? 'SUDAH DITERBITKAN'
                                        : 'BELUM DITERBITKAN'}
                                </span>
                            </div>
                        </div>
                    </aside>
                </form>
            </main>
        </div>
    );
};

export default FormArtikel;