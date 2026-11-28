import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';

const STORAGE_KEY = 'posyanduku_admin_accounts';
const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const TambahAkunKader = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        nama: 'Ratna Sari',
        email: 'ratna@example.com',
        peran: 'Kader',
        posyandu: 'Anggrek 03',
    });

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
        if (!formData.nama.trim() || !formData.email.trim()) return;

        try {
            const existingRaw = localStorage.getItem(STORAGE_KEY);
            const existing = existingRaw ? JSON.parse(existingRaw) : [];

            const newAccount = {
                id: `acc-${Date.now()}`,
                nama: formData.nama.trim(),
                email: formData.email.trim(),
                peran: formData.peran || 'Kader',
                posyandu:
                    formData.peran === 'Admin'
                        ? 'Semua wilayah'
                        : formData.posyandu.trim() || 'Melati 01',
                status: 'Undangan terkirim',
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify([...existing, newAccount])
            );
            localStorage.setItem(
                'posyanduku_last_created_account',
                JSON.stringify(newAccount)
            );
        } catch {
            // Abaikan error penyimpanan lokal jika dibatasi browser
        }

        router.visit('/admin/akun/konfirmasi');
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Tambahkan Petugas Posyandu - Posyanduku" />

            <SidebarAdmin activeMenu="akun" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Akun &amp; peran/Tambah petugas
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
                        Tambahkan petugas posyandu
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Hak akses ditetapkan berdasarkan peran dan penugasan
                    </p>
                </header>

                {/* Kartu Form Akun Petugas */}
                <section className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-5">
                        Akun petugas
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama lengkap */}
                        <div>
                            <label
                                htmlFor="nama"
                                className="block text-xs font-semibold text-[#1E293B] mb-2"
                            >
                                Nama lengkap
                            </label>
                            <input
                                id="nama"
                                name="nama"
                                type="text"
                                required
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap petugas"
                                className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-semibold text-[#1E293B] mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="nama@example.com"
                                className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                            />
                        </div>

                        {/* Baris Peran & Posyandu Tugas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="peran"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Peran
                                </label>
                                <select
                                    id="peran"
                                    name="peran"
                                    value={formData.peran}
                                    onChange={handleChange}
                                    className="w-full rounded-[14px] border border-[#2E5780] bg-white px-4 py-3 text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                >
                                    <option value="Kader">Kader</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="posyandu"
                                    className="block text-xs font-semibold text-[#1E293B] mb-2"
                                >
                                    Posyandu tugas
                                </label>
                                <input
                                    id="posyandu"
                                    name="posyandu"
                                    type="text"
                                    required={formData.peran !== 'Admin'}
                                    disabled={formData.peran === 'Admin'}
                                    value={
                                        formData.peran === 'Admin'
                                            ? 'Semua wilayah'
                                            : formData.posyandu
                                    }
                                    onChange={handleChange}
                                    placeholder="Contoh: Anggrek 03"
                                    className="w-full rounded-[14px] border border-[#2E5780] px-4 py-3 text-[13px] text-[#1E293B] disabled:bg-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B5D5F0]"
                                />
                            </div>
                        </div>

                        {/* Kotak Info Undangan Akun */}
                        <div className="bg-[#B5D5F0] rounded-[14px] px-5 py-4 text-[#1E293B] mt-2">
                            <p className="text-xs font-bold text-[#1E293B]">
                                Undangan akun
                            </p>
                            <p className="text-xs text-[#1E293B]/90 mt-1 leading-relaxed">
                                Pengguna akan menerima undangan aktivasi saat layanan
                                undangan diterapkan. Prototipe hanya memperlihatkan
                                alurnya.
                            </p>
                        </div>

                        {/* Tombol Simpan */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                            >
                                Simpan akun &amp; undangan
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default TambahAkunKader;