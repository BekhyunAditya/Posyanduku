import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';

export const POSYANDU_STORAGE_KEY = 'posyanduku_admin_posyandu_list';

export const INITIAL_POSYANDU_LIST = [
    {
        id: 'melati-01',
        nama: 'Melati 01',
        alamat: 'Balai RW 03, Bekasi',
        wilayah: 'RW 03 · Bekasi',
        wilayahSingkat: 'RW 03',
        penanggungJawab: 'Siti Rahmawati',
        kader: '4 petugas',
        status: 'Aktif',
    },
    {
        id: 'mawar-02',
        nama: 'Mawar 02',
        alamat: 'Balai RW 04, Bekasi',
        wilayah: 'RW 04 · Bekasi',
        wilayahSingkat: 'RW 04',
        penanggungJawab: 'Dewi Anggraini',
        kader: '3 petugas',
        status: 'Aktif',
    },
    {
        id: 'anggrek-03',
        nama: 'Anggrek 03',
        alamat: 'Balai RW 05, Bekasi',
        wilayah: 'RW 05 · Bekasi',
        wilayahSingkat: 'RW 05',
        penanggungJawab: 'Ratna Sari',
        kader: '5 petugas',
        status: 'Aktif',
    },
    {
        id: 'kenanga-04',
        nama: 'Kenanga 04',
        alamat: 'Balai RW 06, Bekasi',
        wilayah: 'RW 06 · Bekasi',
        wilayahSingkat: 'RW 06',
        penanggungJawab: 'Nadia Putri',
        kader: '4 petugas',
        status: 'Aktif',
    },
];

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const KelolaPosyandu = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [posyanduList, setPosyanduList] = useState(INITIAL_POSYANDU_LIST);
    const dropdownRef = useRef(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(POSYANDU_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPosyanduList(parsed);
                }
            } else {
                localStorage.setItem(
                    POSYANDU_STORAGE_KEY,
                    JSON.stringify(INITIAL_POSYANDU_LIST)
                );
            }
        } catch {
            setPosyanduList(INITIAL_POSYANDU_LIST);
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

    const handleTambah = () => {
        localStorage.removeItem('posyanduku_editing_posyandu');
        router.visit('/admin/posyandu/form');
    };

    const handleUbahData = (item) => {
        localStorage.setItem('posyanduku_editing_posyandu', JSON.stringify(item));
        router.visit(`/admin/posyandu/ubah/${item.id}`);
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Data Posyandu - Posyanduku" />

            <SidebarAdmin activeMenu="posyandu" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Data posyandu
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
                        Kelola ruang pelayanan keluarga.
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Pastikan alamat, jadwal operasional, dan penanggung jawab selalu
                        tepat.
                    </p>
                </header>

                {/* Tombol Tambah Posyandu */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleTambah}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                        + Tambah Posyandu
                    </button>
                </div>

                {/* Kartu Tabel Posyandu Terdaftar */}
                <section className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">
                        Posyandu terdaftar
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#FDEBD3] text-[#1E293B] text-xs font-semibold">
                                    <th className="py-3 px-4 rounded-l-[10px]">
                                        Nama posyandu
                                    </th>
                                    <th className="py-3 px-4">Wilayah</th>
                                    <th className="py-3 px-4">Kader</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 rounded-r-[10px]">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] text-[#334155]">
                                {posyanduList.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-[#7B9EC0]/60 hover:bg-[#F8FAFC] transition-colors"
                                    >
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {item.nama}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {item.wilayah}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {item.kader}
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {item.status}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                type="button"
                                                onClick={() => handleUbahData(item)}
                                                className="inline-flex items-center gap-1 text-[#1E293B] hover:text-[#2E5780] font-medium transition-colors cursor-pointer"
                                            >
                                                <span>Ubah data</span>
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

export default KelolaPosyandu;