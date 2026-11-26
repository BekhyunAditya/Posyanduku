import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, UserPlus, BookOpen, Bell, LogOut } from 'lucide-react';
import logoImg from '../../assets/images/Logo.png';

const NAV_ITEMS = [
  { label: 'Beranda', to: '/ortu/dashboard' },
  { label: 'Pertumbuhan', to: '/ortu/pertumbuhan' },
  { label: 'Jadwal', to: '/ortu/jadwal-posyandu' },
  { label: 'Panduan', to: '/ortu/panduan-kunjungan' },
  { label: 'Edukasi', to: '/edukasi' },
];

export default function NavbarOrtu({ userName = 'Nadia' }) {
  const navigate = useNavigate();
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
    localStorage.removeItem('posyanduku_token');
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="w-full pt-6 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-5xl mx-auto bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Sisi Kiri: Logo & Nama Brand Posyanduku */}
        <Link to="/ortu/dashboard" className="flex items-center gap-2.5 shrink-0">
          <img
            src={logoImg}
            alt="Logo Posyanduku"
            className="w-9 h-9 object-contain shrink-0"
          />
          <span className="text-xl font-bold tracking-tight text-[#315B87]">
            Posyanduku
          </span>
        </Link>

        {/* Sisi Kanan: Menu Navigasi Desktop + Kapsul Profil Akun */}
        <div className="flex items-center gap-6 lg:gap-[52px]">
          {/* Menu Navigasi Desktop */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-[52px] text-sm font-medium text-[#1D3B58]">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-block pb-1 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'font-semibold text-[#1D3B58] border-b-2 border-[#1D3B58]'
                        : 'text-[#1D3B58]/90 hover:text-[#2E5780] border-b-2 border-transparent'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Tombol Kapsul Profil Akun & Hamburger Mobile */}
          <div className="flex items-center gap-2.5">
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

              {/* Menu Dropdown Akun */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 py-2 z-50">
                  <Link
                    to="/ortu/profil-anak"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1D3B58] hover:bg-[#F7F5F0] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#2E5780]" />
                    Profil Anak
                  </Link>
                  <Link
                    to="/ortu/tambah-anak"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1D3B58] hover:bg-[#F7F5F0] transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-[#2E5780]" />
                    Tambah Profil Anak
                  </Link>
                  <Link
                    to="/ortu/buku-kia"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1D3B58] hover:bg-[#F7F5F0] transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-[#2E5780]" />
                    Buku KIA Pendamping
                  </Link>
                  <Link
                    to="/ortu/pengingat"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1D3B58] hover:bg-[#F7F5F0] transition-colors"
                  >
                    <Bell className="w-4 h-4 text-[#2E5780]" />
                    Notifikasi & Pengingat
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

            {/* Tombol Hamburger Khusus Layar Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-full text-[#1D3B58] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Panel Menu Navigasi Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2.5 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-4">
          <ul className="flex flex-col gap-1.5 text-sm font-medium text-[#1D3B58]">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#2E5780] text-white font-semibold'
                        : 'hover:bg-[#F7F5F0]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}