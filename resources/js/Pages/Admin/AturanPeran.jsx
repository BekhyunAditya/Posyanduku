import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';

const ACCESS_MATRIX_ROWS = [
    {
        area: 'Profil anak',
        orangTua: 'Anak terkait',
        kader: 'Balita binaan',
        admin: 'Kelola hubungan akun',
    },
    {
        area: 'Pengukuran',
        orangTua: 'Lihat riwayat',
        kader: 'Catat & koreksi dengan jejak',
        admin: 'Statistik agregat',
    },
    {
        area: 'Imunisasi',
        orangTua: 'Lihat status',
        kader: 'Catat & ajukan verifikasi',
        admin: 'Atur mekanisme akses',
    },
    {
        area: 'Kegiatan',
        orangTua: 'Lihat jadwal',
        kader: 'Buat kegiatan',
        admin: 'Kelola posyandu',
    },
    {
        area: 'Edukasi',
        orangTua: 'Baca materi',
        kader: 'Gunakan untuk pendampingan',
        admin: 'Kelola publikasi',
    },
    {
        area: 'Akun & sistem',
        orangTua: 'Profil sendiri',
        kader: 'Profil sendiri',
        admin: 'Kelola akun dan konfigurasi',
    },
];

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const AturanPeran = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
            <Head title="Aturan Peran & Hak Akses - Posyanduku" />

            <SidebarAdmin activeMenu="akun" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Akun &amp; peran/Aturan peran
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
                        Batas hak akses yang jelas
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Peran menentukan data yang dapat dilihat dan tindakan yang
                        tersedia
                    </p>
                </header>

                {/* Kartu Tabel Hak Akses Pengguna */}
                <section className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">
                        Hak akses pengguna
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#FDEBD3] text-[#1E293B] text-xs font-semibold">
                                    <th className="py-3 px-4 rounded-l-[10px]">
                                        Area
                                    </th>
                                    <th className="py-3 px-4">Orang tua</th>
                                    <th className="py-3 px-4">Kader</th>
                                    <th className="py-3 px-4 rounded-r-[10px]">
                                        Admin
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] text-[#334155]">
                                {ACCESS_MATRIX_ROWS.map((row) => (
                                    <tr
                                        key={row.area}
                                        className="border-b border-[#7B9EC0]/60 hover:bg-[#F8FAFC] transition-colors"
                                    >
                                        <td className="py-3.5 px-4 font-semibold text-[#1E293B]">
                                            {row.area}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {row.orangTua}
                                        </td>
                                        <td className="py-3.5 px-4">{row.kader}</td>
                                        <td className="py-3.5 px-4">{row.admin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Banner Verifikasi Klinis */}
                <section className="bg-[#B5D5F0] rounded-[18px] px-6 py-5 text-[#1E293B] mb-6">
                    <h3 className="text-[15px] font-bold text-[#1E293B]">
                        Verifikasi klinis
                    </h3>
                    <p className="text-[13px] text-[#1E293B]/90 mt-1.5 leading-relaxed">
                        Kewenangan memverifikasi catatan imunisasi dan interpretasi
                        kesehatan diberikan kepada tenaga kesehatan yang ditunjuk,
                        bukan otomatis kepada admin atau kader.
                    </p>
                </section>

                {/* Tombol Kembali ke Akun */}
                <div>
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/akun')}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                        Kembali ke akun
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AturanPeran;