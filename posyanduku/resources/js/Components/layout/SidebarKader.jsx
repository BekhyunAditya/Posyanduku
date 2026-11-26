import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, User } from "lucide-react";

const SidebarKader = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentPath = usePage().url.split("?")[0];

    const menuItems = [
        { label: "Ringkasan", to: "/kader/dashboard" },
        { label: "Data balita", to: "/kader/data-balita" },
        { label: "Pengukuran", to: "/kader/pengukuran" },
        { label: "Pelayanan", to: "/kader/pelayanan" },
        { label: "Jadwal Kegiatan", to: "/kader/jadwal-kegiatan" },
        { label: "Tindak Lanjut", to: "/kader/tindak-lanjut" },
    ];

    const SidebarContent = () => (
        <div className="relative flex flex-col justify-between h-full bg-[#2E5780] text-white px-5 py-7 overflow-hidden select-none">
            {/* Dekorasi Watermark Latar Belakang Kiri Bawah */}
            <svg
                viewBox="0 0 260 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute -left-8 -bottom-6 w-[270px] h-[290px] text-white/[0.07]"
                aria-hidden="true"
            >
                {/* Atap Rumah & Tanda Plus */}
                <path
                    d="M18 112L118 28C125 22 135 22 142 28L242 112"
                    stroke="currentColor"
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect
                    x="116"
                    y="76"
                    width="28"
                    height="76"
                    rx="6"
                    fill="currentColor"
                />
                <rect
                    x="92"
                    y="100"
                    width="76"
                    height="28"
                    rx="6"
                    fill="currentColor"
                />
                {/* Siluet Ibu & Anak */}
                <circle cx="96" cy="176" r="24" fill="currentColor" />
                <circle cx="164" cy="196" r="18" fill="currentColor" />
                <path
                    d="M44 268C48 226 76 208 104 208C126 208 142 220 150 236C160 226 176 222 192 228C210 234 220 250 222 268H44Z"
                    fill="currentColor"
                />
            </svg>

            {/* Bagian Atas: Brand + Menu */}
            <div className="relative z-10">
                <div className="px-2 mb-8">
                    <Link href="/kader/dashboard" className="block">
                        <span className="block text-[26px] font-extrabold tracking-tight leading-none text-white">
                            Posyanduku
                        </span>
                        <span className="block mt-1.5 text-[14px] font-medium text-white/90">
                            Kader Posyandu
                        </span>
                    </Link>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.to}
                            href={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-[14px] text-[15px] transition-all duration-200 ${
                                currentPath === item.to ||
                                currentPath.startsWith(`${item.to}/`)
                                    ? "bg-[#B5D5F0] text-[#1D3B58] font-bold shadow-sm"
                                    : "text-white/90 font-semibold hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bagian Bawah: Kartu Profil Kader + Keluar */}
            <div className="relative z-10 mt-8 bg-[#1E3F60]/75 backdrop-blur-sm border border-white/10 rounded-[20px] p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 text-[#2E5780]">
                        <User className="w-6 h-6 fill-[#2E5780]" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[14px] font-bold text-white truncate">
                            Siti Rahmawati
                        </p>
                        <p className="text-[11.5px] text-white/80 truncate">
                            Kader • Melati 01
                        </p>
                    </div>
                </div>

                <Link
                    href="/login"
                    className="mt-3.5 w-full block text-center bg-[#366491] hover:bg-[#4173A4] text-white text-[14px] font-bold py-2 rounded-full transition-colors duration-200 shadow-sm"
                >
                    Keluar
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Top Bar Mobile */}
            <div className="lg:hidden sticky top-0 z-40 bg-[#2E5780] text-white px-4 py-3 flex items-center justify-between shadow-md">
                <div>
                    <span className="text-lg font-extrabold tracking-tight">
                        Posyanduku
                    </span>
                    <span className="ml-2 text-xs text-white/80">
                        Kader Posyandu
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Buka Menu Kader"
                >
                    {mobileOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Drawer Mobile */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="relative w-[265px] max-w-[80vw] h-full z-10">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-[255px] shrink-0 min-h-screen sticky top-0 h-screen">
                <SidebarContent />
            </aside>
        </>
    );
};

export default SidebarKader;
