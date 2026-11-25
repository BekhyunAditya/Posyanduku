import { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, User, BookOpen, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Beranda', to: '/ortu/dashboard' },
  { label: 'Pertumbuhan', to: '/ortu/pertumbuhan' },
  { label: 'Jadwal', to: '/ortu/jadwal-posyandu' },
  { label: 'Panduan', to: '/ortu/panduan-kunjungan' },
  { label: 'Edukasi', to: '/edukasi' },
];

export default function NavbarOrtu({ userName = 'Nadia' }) {
  const currentPath = usePage().url.split('?')[0];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initial = userName.trim().charAt(0).toUpperCase() || 'N';

  // Tutup dropdown akun saat klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    router.post(route('logout'));
  };

  return (
    <header className="w-full pt-6 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-5xl mx-auto bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Kiri: Logo Posyanduku */}
        <Link href="/ortu/dashboard" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-md bg-[#2E5780] shrink-0" />
          <span className="text-xl font-bold tracking-tight text-[#1D3B58]">
            Posyanduku
          </span>
        </Link>

        {/* Tengah: Menu Navigasi Desktop (Tanpa Overflow/Scrollbar) */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#1D3B58]">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                href={item.to}
                className={`inline-block py-1 transition-colors ${
                  currentPath === item.to || currentPath.startsWith(`${item.to}/`)
                    ? 'font-semibold text-[#1D3B58] border-b-2 border-[#1D3B58]'
                    : 'text-[#1D3B58]/85 hover:text-[#2E5780] border-b-2 border-transparent'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Kanan: Tombol Kapsul Profil Akun & Hamburger Mobile */}
        <div className="flex items-center gap-2.5">
          {/* Dropdown Akun */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-[#2E5780] hover:bg-[#234466] text-white rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2.5 transition-colors cursor-pointer shrink-0"
            >
              <span className="w-7 h-7 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {initial}
              </span>
              <span className="text-xs sm:text-[13px] font-semibold whitespace-nowrap">
                {userName} - Akun
              </span>
            </button>

            {/* Menu Dropdown Saat Tombol Akun Diklik */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 py-2 z-50">
                <Link
                  href="/ortu/profil-anak"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1D3B58] hover:bg-[#F7F5F0] transition-colors"
                >
                  <User className="w-4 h-4 text-[#2E5780]" />
                  Profil Anak
                </Link>
                <Link
                  href="/ortu/buku-kia"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1D3B58] hover:bg-[#F7F5F0] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#2E5780]" />
                  Buku KIA Pendamping
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>

          {/* Tombol Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-full text-[#1D3B58] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Panel Menu Navigasi Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2.5 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-4">
          <ul className="flex flex-col gap-1.5 text-sm font-medium text-[#1D3B58]">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  href={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl transition-colors ${
                    currentPath === item.to || currentPath.startsWith(`${item.to}/`)
                      ? 'bg-[#2E5780] text-white font-semibold'
                      : 'hover:bg-[#F7F5F0]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}