import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';
import {
    POSYANDU_STORAGE_KEY,
    INITIAL_POSYANDU_LIST,
} from './KelolaPosyandu';

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const FormPosyandu = ({ slug = null }) => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isEditMode = Boolean(slug);

    const [formData, setFormData] = useState({
        id: null,
        nama: 'Melati 01',
        alamat: 'Balai RW 03, Bekasi',
        wilayah: 'RW 03',
        penanggungJawab: 'Siti Rahmawati',
        status: 'Aktif',
        kader: '4 petugas',
    });

    useEffect(() => {
        if (!isEditMode) {
            setFormData({
                id: null,
                nama: '',
                alamat: '',
                wilayah: '',
                penanggungJawab: '',
                status: 'Aktif',
                kader: '3 petugas',
            });
            return;
        }

        try {
            const savedListRaw = localStorage.getItem(POSYANDU_STORAGE_KEY);
            const savedList = savedListRaw
                ? JSON.parse(savedListRaw)
                : INITIAL_POSYANDU_LIST;

            const found = savedList.find((item) => item.id === slug);
            if (found) {
                setFormData({
                    id: found.id,
                    nama: found.nama,
                    alamat: found.alamat || `Balai ${found.wilayahSingkat || found.wilayah}, Bekasi`,
                    wilayah:
                        found.wilayahSingkat ||
                        (found.wilayah || '').split('·')[0].trim(),
                    penanggungJawab: found.penanggungJawab || 'Siti Rahmawati',
                    status: found.status || 'Aktif',
                    kader: found.kader || '4 petugas',
                });
            }
        } catch {
            // Gunakan nilai default jika gagal membaca localStorage
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nama.trim()) return;

        try {
            const existingRaw = localStorage.getItem(POSYANDU_STORAGE_KEY);
            const existingList = existingRaw
                ? JSON.parse(existingRaw)
                : INITIAL_POSYANDU_LIST;

            const wilayahFormatted = formData.wilayah.includes('·')
                ? formData.wilayah.trim()
                : `${formData.wilayah.trim() || 'RW 03'} · Bekasi`;

            if (isEditMode && formData.id) {
                const updatedList = existingList.map((item) =>
                    item.id === formData.id
                        ? {
                              ...item,
                              nama: formData.nama.trim(),
                              alamat: formData.alamat.trim(),
                              wilayah: wilayahFormatted,
                              wilayahSingkat: formData.wilayah.trim(),
                              penanggungJawab: formData.penanggungJawab.trim(),
                              status: formData.status.trim() || 'Aktif',
                          }
                        : item
                );
                localStorage.setItem(
                    POSYANDU_STORAGE_KEY,
                    JSON.stringify(updatedList)
                );
            } else {
                const newId = `${formData.nama
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')}-${Date.now()}`;

                const newEntry = {
                    id: newId,
                    nama: formData.nama.trim(),
                    alamat: formData.alamat.trim() || 'Balai RW, Bekasi',
                    wilayah: wilayahFormatted,
                    wilayahSingkat: formData.wilayah.trim() || 'RW 03',
                    penanggungJawab:
                        formData.penanggungJawab.trim() || 'Siti Rahmawati',
                    kader: formData.kader || '3 petugas',
                    status: formData.status.trim() || 'Aktif',
                };

                localStorage.setItem(
                    POSYANDU_STORAGE_KEY,
                    JSON.stringify([...existingList, newEntry])
                );
            }
        } catch {
            // Abaikan error penyimpanan lokal jika dibatasi browser
        }

        router.visit('/admin/posyandu/konfirmasi');
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head
                title={`${
                    isEditMode ? 'Perbarui Data Posyandu' : 'Tambah Data Posyandu'
                } - Posyanduku`}
            />

            <SidebarAdmin activeMenu="posyandu" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Data posyandu/{isEditMode ? 'Perbarui data' : 'Tambah baru'}
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
                <header className="mb-6">
                    <h1 className="text-3xl sm:text-[36px] font-bold text-[#1E293B] tracking-tight leading-tight">
                        {isEditMode
                            ? 'Perbarui data posyandu'
                            : 'Tambah data posyandu'}
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Informasi ini digunakan untuk jadwal dan hubungan keluarga
                    </p>
                </header>

                {/* Kartu Form Data Posyandu */}
                <section className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-5">
                        {formData.nama
                            ? `Posyandu ${formData.nama}`
                            : 'Informasi posyandu baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input 1: Nama posyandu (label di bawah input sesuai Figma) */}
                        <div>
                            <input
                                id="nama"
                                name="nama"
                                type="text"
                                required
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Contoh: Melati 01"
                                className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                            />
                            <label
                                htmlFor="nama"
                                className="block text-xs font-semibold text-[#1E293B] mt-2"
                            >
                                Nama posyandu
                            </label>
                        </div>

                        {/* Input 2: Alamat pelayanan (label di bawah input sesuai Figma) */}
                        <div>
                            <input
                                id="alamat"
                                name="alamat"
                                type="text"
                                required
                                value={formData.alamat}
                                onChange={handleChange}
                                placeholder="Contoh: Balai RW 03, Bekasi"
                                className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                            />
                            <label
                                htmlFor="alamat"
                                className="block text-xs font-semibold text-[#1E293B] mt-2"
                            >
                                Alamat pelayanan
                            </label>
                        </div>

                        {/* Baris Wilayah & Penanggung jawab */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div>
                                <label
                                    htmlFor="wilayah"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Wilayah
                                </label>
                                <input
                                    id="wilayah"
                                    name="wilayah"
                                    type="text"
                                    required
                                    value={formData.wilayah}
                                    onChange={handleChange}
                                    placeholder="Contoh: RW 03"
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="penanggungJawab"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Penanggung jawab
                                </label>
                                <input
                                    id="penanggungJawab"
                                    name="penanggungJawab"
                                    type="text"
                                    required
                                    value={formData.penanggungJawab}
                                    onChange={handleChange}
                                    placeholder="Contoh: Siti Rahmawati"
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-xs font-semibold text-[#1E293B] mb-2"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-[14px] border border-[#2E5780] bg-white px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                            >
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>

                        {/* Tombol Simpan */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                            >
                                Simpan data posyandu
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default FormPosyandu;