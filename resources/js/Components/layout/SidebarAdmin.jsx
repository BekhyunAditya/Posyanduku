import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, User } from 'lucide-react';

const SidebarAdmin = ({ activeMenu }) => {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        {
            key: 'ringkasan',
            label: 'Ringkasan',
            href: '/admin/dashboard',
            matchPaths: ['/admin', '/admin/dashboard', '/admin/ringkasan'],
        },
        {
            key: 'akun',
            label: 'Akun & peran',
            href: '/admin/akun',
            matchPaths: ['/admin/akun'],
        },
        {
            key: 'posyandu',
            label: 'Data posyandu',
            href: '/admin/posyandu',
            matchPaths: ['/admin/posyandu'],
        },
        {
            key: 'edukasi',
            label: 'Artikel & edukasi',
            href: '/admin/edukasi',
            matchPaths: ['/admin/edukasi'],
        },
        {
            key: 'kategori-edukasi',
            label: 'Kategori edukasi',
            href: '/admin/kategori-edukasi',
            matchPaths: ['/admin/kategori-edukasi'],
        },
        {
            key: 'pengaturan',
            label: 'Pengaturan',
            href: '/admin/pengaturan',
            matchPaths: ['/admin/pengaturan'],
        },
    ];

    const isItemActive = (item) => {
        if (activeMenu) {
            return activeMenu.toLowerCase() === item.key;
        }
        const currentPath = (url || '').split('?')[0];
        return item.matchPaths.some(
            (path) =>
                currentPath === path ||
                (path !== '/admin' && currentPath.startsWith(`${path}/`))
        );
    };

    const handleLogout = () => {
        localStorage.removeItem('posyanduku_user_role');
        router.visit('/masuk');
    };

    const SidebarContent = () => (
        <div className="relative flex flex-col justify-between h-full w-full bg-[#2E5780] text-white px-5 py-7 overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Watermark Siluet Rumah & Tanda Plus di Bagian Bawah */}
            <svg
                viewBox="0 0 260 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute -bottom-6 -left-6 w-[270px] h-[290px] opacity-[0.12]"
                aria-hidden="true"
            >
                <path
                    d="M130 22L22 108V258H88V184C88 164.118 104.118 148 124 148H136C155.882 148 172 164.118 172 184V258H238V108L130 22Z"
                    stroke="white"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M130 74V118M108 96H152"
                    stroke="white"
                    strokeWidth="18"
                    strokeLinecap="round"
                />
            </svg>

            {/* Bagian Atas: Brand & Menu Navigasi */}
            <div className="relative z-10">
                <div className="px-2 mb-8">
                    <Link href="/admin/dashboard" className="block">
                        <h1 className="text-[26px] font-bold tracking-tight text-white leading-tight">
                            Posyanduku
                        </h1>
                        <p className="text-sm font-medium text-white/90 mt-0.5">
                            Ruang Admin
                        </p>
                    </Link>
                </div>

                <nav className="space-y-1.5" aria-label="Navigasi Ruang Admin">
                    {menuItems.map((item) => {
                        const active = isItemActive(item);
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center w-full px-4 py-3 rounded-[12px] text-[15px] transition-all duration-200 ${
                                    active
                                        ? 'bg-[#B5D5F0] text-[#1E293B] font-semibold shadow-sm'
                                        : 'text-white/95 font-medium hover:bg-white/10'
                                }`}
                            >
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bagian Bawah: Kartu Profil Admin & Tombol Keluar */}
            <div className="relative z-10 mt-8">
                <div className="bg-[#1B3957]/75 backdrop-blur-sm rounded-[18px] p-3.5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#3E6A96] flex items-center justify-center shrink-0 overflow-hidden border border-white/20">
                            <User className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">
                                Admin Posyanduku
                            </p>
                            <p className="text-[11px] text-slate-200/85 truncate">
                                Administrator sistem
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full py-2 px-4 rounded-full bg-[#4A759E]/65 hover:bg-[#4A759E] text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                        Keluar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Top Bar Mobile */}
            <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-[#2E5780] text-white px-4 py-3 shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                <div>
                    <span className="font-bold text-lg tracking-tight">
                        Posyanduku
                    </span>
                    <span className="ml-2 text-xs text-[#B5D5F0] font-medium">
                        Ruang Admin
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Buka menu admin"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar Desktop (Fixed Kiri) */}
            <aside className="hidden lg:block lg:w-[260px] lg:shrink-0">
                <div className="fixed top-0 left-0 bottom-0 w-[260px] z-20">
                    <SidebarContent />
                </div>
            </aside>

            {/* Drawer Mobile */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative w-[270px] max-w-[82vw] h-full z-10 shadow-xl">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/15 text-white hover:bg-white/25"
                            aria-label="Tutup menu admin"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
};

export default SidebarAdmin;