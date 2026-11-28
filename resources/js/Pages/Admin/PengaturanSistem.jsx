import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';

export const SYSTEM_SETTINGS_STORAGE_KEY = 'posyanduku_admin_system_settings';

const DEFAULT_SETTINGS = {
    kanalPengingat: 'Notifikasi di dalam website · aktif',
    zonaWaktu: 'Asia/Jakarta · WIB',
    undanganKader: 'Hanya dari administrator',
    aksesCatatan: 'Orang tua terkait & petugas berwenang',
};

const REFERENCE_ROWS = [
    {
        konfigurasi: 'Kurva pertumbuhan',
        sumber: 'Standar WHO + acuan nasional sesuai kebutuhan',
        status: 'Belum dikonfigurasi',
    },
    {
        konfigurasi: 'Jadwal imunisasi',
        sumber: 'Panduan Kemenkes yang berlaku',
        status: 'Menunggu verifikasi',
    },
    {
        konfigurasi: 'Pencatatan perubahan',
        sumber: 'Akun, waktu, aksi, dan objek yang berubah',
        status: 'Dirancang untuk implementasi',
    },
];

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const PengaturanSistem = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const dropdownRef = useRef(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(SYSTEM_SETTINGS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    setSettings((prev) => ({ ...prev, ...parsed }));
                }
            } else {
                localStorage.setItem(
                    SYSTEM_SETTINGS_STORAGE_KEY,
                    JSON.stringify(DEFAULT_SETTINGS)
                );
            }
        } catch {
            setSettings(DEFAULT_SETTINGS);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            localStorage.setItem(
                SYSTEM_SETTINGS_STORAGE_KEY,
                JSON.stringify(settings)
            );
        } catch {
            // Abaikan error penyimpanan lokal jika dibatasi browser
        }
        router.visit('/admin/pengaturan/konfirmasi');
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Pengaturan Sistem" />

            <SidebarAdmin activeMenu="pengaturan" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Pengaturan
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
                        Pengaturan sistem posyanduku
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Kelola pengingat, akses, dan acuan yang digunakan sistem.
                    </p>
                </header>

                {/* Bagian Atas: 2 Kolom (Notifikasi & Akses + Pengembangan Berikutnya) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mb-6">
                    {/* Kartu Kiri: Notifikasi & akses */}
                    <section className="lg:col-span-8 bg-white rounded-[24px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <h2 className="text-[18px] font-bold text-[#1E293B] mb-5">
                            Notifikasi &amp; akses
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Kanal pengingat MVP */}
                            <div>
                                <label
                                    htmlFor="kanalPengingat"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Kanal pengingat MVP
                                </label>
                                <select
                                    id="kanalPengingat"
                                    name="kanalPengingat"
                                    value={settings.kanalPengingat}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-[14px] bg-[#F4F2EC] px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#B5D5F0] cursor-pointer"
                                >
                                    <option value="Notifikasi di dalam website · aktif">
                                        Notifikasi di dalam website · aktif
                                    </option>
                                    <option value="Notifikasi di dalam website · nonaktif">
                                        Notifikasi di dalam website · nonaktif
                                    </option>
                                </select>
                            </div>

                            {/* Zona waktu kegiatan */}
                            <div>
                                <label
                                    htmlFor="zonaWaktu"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Zona waktu kegiatan
                                </label>
                                <select
                                    id="zonaWaktu"
                                    name="zonaWaktu"
                                    value={settings.zonaWaktu}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-[14px] bg-[#F4F2EC] px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#B5D5F0] cursor-pointer"
                                >
                                    <option value="Asia/Jakarta · WIB">
                                        Asia/Jakarta · WIB
                                    </option>
                                    <option value="Asia/Makassar · WITA">
                                        Asia/Makassar · WITA
                                    </option>
                                    <option value="Asia/Jayapura · WIT">
                                        Asia/Jayapura · WIT
                                    </option>
                                </select>
                            </div>

                            {/* Undangan kader */}
                            <div>
                                <label
                                    htmlFor="undanganKader"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Undangan kader
                                </label>
                                <select
                                    id="undanganKader"
                                    name="undanganKader"
                                    value={settings.undanganKader}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-[14px] bg-[#F4F2EC] px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#B5D5F0] cursor-pointer"
                                >
                                    <option value="Hanya dari administrator">
                                        Hanya dari administrator
                                    </option>
                                    <option value="Administrator & koordinator wilayah">
                                        Administrator &amp; koordinator wilayah
                                    </option>
                                </select>
                            </div>

                            {/* Akses catatan kesehatan */}
                            <div>
                                <label
                                    htmlFor="aksesCatatan"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Akses catatan kesehatan
                                </label>
                                <select
                                    id="aksesCatatan"
                                    name="aksesCatatan"
                                    value={settings.aksesCatatan}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-[14px] bg-[#F4F2EC] px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#B5D5F0] cursor-pointer"
                                >
                                    <option value="Orang tua terkait & petugas berwenang">
                                        Orang tua terkait &amp; petugas berwenang
                                    </option>
                                    <option value="Hanya tenaga kesehatan & orang tua terkait">
                                        Hanya tenaga kesehatan &amp; orang tua terkait
                                    </option>
                                </select>
                            </div>

                            {/* Tombol Simpan Pengaturan */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-10 py-3 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                                >
                                    Simpan pengaturan
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Kartu Kanan: Pengembangan berikutnya */}
                    <aside className="lg:col-span-4 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <h2 className="text-[17px] font-bold text-[#1E293B] mb-4">
                            Pengembangan berikutnya
                        </h2>

                        <div>
                            <h3 className="text-[15px] font-bold text-[#F3831E]">
                                WhatsApp / email
                            </h3>
                            <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                                Belum diaktifkan. Memerlukan penyedia layanan dan
                                persetujuan penerima.
                            </p>
                        </div>

                        <hr className="border-t border-[#7B9EC0]/60 my-4" />

                        <div>
                            <h3 className="text-[15px] font-bold text-[#F3831E]">
                                Integrasi nasional
                            </h3>
                            <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                                Belum terhubung. Hanya dikembangkan setelah izin dan
                                akses resmi tersedia.
                            </p>
                        </div>
                    </aside>
                </div>

                {/* Bagian Bawah: Tabel Acuan kesehatan & jejak perubahan */}
                <section className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">
                        Acuan kesehatan &amp; jejak perubahan
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#FDEBD3] text-[#1E293B] text-xs font-semibold">
                                    <th className="py-3 px-4 rounded-l-[10px]">
                                        Konfigurasi
                                    </th>
                                    <th className="py-3 px-4">
                                        Sumber yang diperlukan
                                    </th>
                                    <th className="py-3 px-4 rounded-r-[10px]">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] text-[#334155]">
                                {REFERENCE_ROWS.map((row) => (
                                    <tr
                                        key={row.konfigurasi}
                                        className="border-b border-[#7B9EC0]/60 hover:bg-[#F8FAFC] transition-colors"
                                    >
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {row.konfigurasi}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {row.sumber}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {row.status}
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

export default PengaturanSistem;