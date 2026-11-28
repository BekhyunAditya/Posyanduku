import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';

const MONTHLY_DASHBOARD_DATA = {
    'November 2026': {
        posyanduAktif: 128,
        akunKaderTotal: 48,
        akunKaderDetail: '44 aktif · 4 belum aktif',
        keluargaTerhubungUtama: 1248,
        keluargaTerhubungSorotan: 24,
        undanganBelumAktif: 4,
        draftEdukasi: 6,
        aktivitasPosyandu: [
            {
                id: 'melati-01',
                nama: 'Melati 01',
                kaderAktif: 4,
                balitaTerdaftar: 128,
                kunjunganBulanIni: 86,
                status: 'Aktif',
            },
            {
                id: 'mawar-02',
                nama: 'Mawar 02',
                kaderAktif: 3,
                balitaTerdaftar: 96,
                kunjunganBulanIni: 72,
                status: 'Aktif',
            },
            {
                id: 'anggrek-03',
                nama: 'Anggrek 03',
                kaderAktif: 5,
                balitaTerdaftar: 140,
                kunjunganBulanIni: 110,
                status: 'Aktif',
            },
            {
                id: 'kenanga-04',
                nama: 'Kenanga 04',
                kaderAktif: 4,
                balitaTerdaftar: 102,
                kunjunganBulanIni: 69,
                status: 'Aktif',
            },
        ],
    },
    'Oktober 2026': {
        posyanduAktif: 125,
        akunKaderTotal: 46,
        akunKaderDetail: '43 aktif · 3 belum aktif',
        keluargaTerhubungUtama: 1210,
        keluargaTerhubungSorotan: 19,
        undanganBelumAktif: 3,
        draftEdukasi: 4,
        aktivitasPosyandu: [
            {
                id: 'melati-01',
                nama: 'Melati 01',
                kaderAktif: 4,
                balitaTerdaftar: 124,
                kunjunganBulanIni: 81,
                status: 'Aktif',
            },
            {
                id: 'mawar-02',
                nama: 'Mawar 02',
                kaderAktif: 3,
                balitaTerdaftar: 94,
                kunjunganBulanIni: 68,
                status: 'Aktif',
            },
            {
                id: 'anggrek-03',
                nama: 'Anggrek 03',
                kaderAktif: 5,
                balitaTerdaftar: 136,
                kunjunganBulanIni: 104,
                status: 'Aktif',
            },
            {
                id: 'kenanga-04',
                nama: 'Kenanga 04',
                kaderAktif: 4,
                balitaTerdaftar: 99,
                kunjunganBulanIni: 65,
                status: 'Aktif',
            },
        ],
    },
    'September 2026': {
        posyanduAktif: 122,
        akunKaderTotal: 45,
        akunKaderDetail: '42 aktif · 3 belum aktif',
        keluargaTerhubungUtama: 1185,
        keluargaTerhubungSorotan: 21,
        undanganBelumAktif: 2,
        draftEdukasi: 5,
        aktivitasPosyandu: [
            {
                id: 'melati-01',
                nama: 'Melati 01',
                kaderAktif: 4,
                balitaTerdaftar: 120,
                kunjunganBulanIni: 79,
                status: 'Aktif',
            },
            {
                id: 'mawar-02',
                nama: 'Mawar 02',
                kaderAktif: 3,
                balitaTerdaftar: 91,
                kunjunganBulanIni: 64,
                status: 'Aktif',
            },
            {
                id: 'anggrek-03',
                nama: 'Anggrek 03',
                kaderAktif: 5,
                balitaTerdaftar: 133,
                kunjunganBulanIni: 98,
                status: 'Aktif',
            },
            {
                id: 'kenanga-04',
                nama: 'Kenanga 04',
                kaderAktif: 4,
                balitaTerdaftar: 97,
                kunjunganBulanIni: 61,
                status: 'Aktif',
            },
        ],
    },
};

const DashboardAdmin = ({ adminName = 'Bu Siti' }) => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const monthOptions = Object.keys(MONTHLY_DASHBOARD_DATA);
    const currentStats =
        MONTHLY_DASHBOARD_DATA[selectedMonth] ||
        MONTHLY_DASHBOARD_DATA['November 2026'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const statCards = [
        {
            id: 'posyandu-aktif',
            value: currentStats.posyanduAktif,
            title: 'Posyandu Aktif',
            subtitle: 'Dalam wilayah Pengelolaan',
            highlighted: false,
            href: '/admin/posyandu',
        },
        {
            id: 'akun-kader',
            value: currentStats.akunKaderTotal,
            title: 'Akun Kader',
            subtitle: currentStats.akunKaderDetail,
            highlighted: false,
            href: '/admin/akun',
        },
        {
            id: 'keluarga-terhubung-1',
            value: currentStats.keluargaTerhubungUtama,
            title: 'Keluarga terhubung',
            subtitle: 'statistik agregat',
            highlighted: false,
            href: '/admin/posyandu',
        },
        {
            id: 'keluarga-terhubung-2',
            value: currentStats.keluargaTerhubungSorotan,
            title: 'Keluarga terhubung',
            subtitle: 'statistik agregat',
            highlighted: true,
            href: '/admin/posyandu',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Ringkasan Admin - Posyanduku" />

            {/* Sidebar Kiri */}
            <SidebarAdmin activeMenu="ringkasan" />

            {/* Konten Utama */}
            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Ringkasan
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
                            {monthOptions.map((month) => (
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

                {/* Header Sapaan */}
                <header className="mb-7">
                    <h1 className="text-3xl sm:text-[36px] font-bold text-[#1E293B] tracking-tight leading-tight">
                        Halo, {adminName}!
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Berikut ringkasan kegiatan posyandu bulan ini.
                    </p>
                </header>

                {/* 4 Kartu Statistik */}
                <section
                    aria-label="Statistik Ringkasan Posyandu"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
                >
                    {statCards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => router.visit(card.href)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    router.visit(card.href);
                                }
                            }}
                            className={`relative rounded-[20px] px-5 py-5 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 ${
                                card.highlighted
                                    ? 'bg-[#B5D5F0] shadow-[0_4px_20px_rgba(46,87,128,0.08)]'
                                    : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]'
                            }`}
                        >
                            <div className="flex flex-col items-center justify-center text-center pr-4">
                                <span className="text-[30px] sm:text-[32px] font-bold text-[#1E293B] leading-none mb-2">
                                    {card.value}
                                </span>
                                <span className="text-[13px] font-medium text-[#334155] leading-snug">
                                    {card.title}
                                </span>
                                <span className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                                    {card.subtitle}
                                </span>
                            </div>

                            {/* Ikon Panah Kanan Bulat */}
                            <span
                                className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 ${
                                    card.highlighted
                                        ? 'bg-[#94BFE3] text-[#1D3B58]'
                                        : 'bg-[#E2E8F0]/80 text-[#334155]'
                                }`}
                            >
                                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                            </span>
                        </div>
                    ))}
                </section>

                {/* Tabel Aktivitas Posyandu */}
                <section className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
                    <h2 className="text-[17px] font-bold text-[#1E293B] mb-4">
                        Aktivitas posyandu
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#FDEBD3] text-[#1E293B] text-xs font-semibold">
                                    <th className="py-3 px-4 rounded-l-[10px]">
                                        Posyandu
                                    </th>
                                    <th className="py-3 px-4">Kader aktif</th>
                                    <th className="py-3 px-4">
                                        Balita terdaftar
                                    </th>
                                    <th className="py-3 px-4">
                                        Kunjungan bulan ini
                                    </th>
                                    <th className="py-3 px-4 rounded-r-[10px]">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] text-[#334155]">
                                {currentStats.aktivitasPosyandu.map((row) => (
                                    <tr
                                        key={row.id}
                                        onClick={() =>
                                            router.visit('/admin/posyandu')
                                        }
                                        className="border-b border-[#7B9EC0]/60 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                                    >
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {row.nama}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {row.kaderAktif}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {row.balitaTerdaftar}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {row.kunjunganBulanIni}
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                                            {row.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Dua Kartu Aksi Bawah */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Kartu Kiri: Akun yang perlu ditinjau */}
                    <div className="lg:col-span-5 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                        <div>
                            <h3 className="text-[19px] font-bold text-[#1E293B]">
                                Akun yang perlu ditinjau
                            </h3>
                            <p className="text-[13px] text-[#475569] mt-1.5 mb-6">
                                {currentStats.undanganBelumAktif} undangan kader
                                belum diaktifkan.
                            </p>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => router.visit('/admin/akun')}
                                className="inline-flex items-center justify-center px-10 py-2.5 rounded-full border border-[#2E5780] text-[#1E293B] hover:bg-[#2E5780] hover:text-white text-[13px] font-semibold transition-colors cursor-pointer"
                            >
                                Kelola akun
                            </button>
                        </div>
                    </div>

                    {/* Kartu Kanan: Konten edukasi */}
                    <div className="lg:col-span-7 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                        <div>
                            <h3 className="text-[19px] font-bold text-[#1E293B]">
                                Konten edukasi
                            </h3>
                            <p className="text-[13px] text-[#475569] mt-1.5 mb-6">
                                {currentStats.draftEdukasi} draft masih
                                memerlukan kelengkapan sumber atau peninjauan.
                            </p>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => router.visit('/admin/edukasi')}
                                className="inline-flex items-center justify-center px-11 py-2.5 rounded-full border border-[#2E5780] text-[#1E293B] hover:bg-[#2E5780] hover:text-white text-[13px] font-semibold transition-colors cursor-pointer"
                            >
                                Tinjau konten
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardAdmin;