import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../../assets/images/Logo.png';

const PUBLIC_NAV_ITEMS = [
  { label: 'Layanan', to: '/#layanan', isHash: true },
  { label: 'Cara Kerja', to: '/#cara-kerja', isHash: true },
  { label: 'Edukasi', to: '/edukasi', isHash: false },
  { label: 'Tentang Kami', to: '/#tentang-kami', isHash: true },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHashClick = (e, to) => {
    setMobileMenuOpen(false);
    const hash = to.split('#')[1];
    if (window.location.pathname === '/' && hash) {
      const target = document.getElementById(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="w-full pt-6 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-5xl mx-auto bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* 1. Sisi Kiri: Logo & Nama Brand Posyanduku */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={logoImg}
            alt="Logo Posyanduku"
            className="w-9 h-9 object-contain shrink-0"
          />
          <span className="text-xl font-bold tracking-tight text-[#315B87]">
            Posyanduku
          </span>
        </Link>

        {/* 2. Menu Navigasi Desktop (Jarak Antar-Item Otomatis Sama Rata) */}
        {PUBLIC_NAV_ITEMS.map((item) =>
          item.isHash ? (
            <Link
              key={item.label}
              to={item.to}
              onClick={(e) => handleHashClick(e, item.to)}
              className="hidden md:inline-block pb-0.5 text-[15px] font-medium text-[#1D3B58] hover:text-[#315B87] transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `hidden md:inline-block pb-0.5 text-[15px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'font-semibold text-[#315B87] border-b-2 border-[#315B87]'
                    : 'text-[#1D3B58] hover:text-[#315B87]'
                }`
              }
            >
              {item.label}
            </NavLink>
          )
        )}

        {/* 3. Sisi Kanan: Tombol Kapsul Masuk & Toggle Mobile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/login"
            className="bg-[#315B87] hover:bg-[#26486b] text-white text-sm sm:text-[15px] font-bold px-8 sm:px-11 py-2.5 rounded-full transition-colors whitespace-nowrap"
          >
            Masuk
          </Link>

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
            {PUBLIC_NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={(e) => handleHashClick(e, item.to)}
                  className="block px-4 py-2.5 rounded-xl hover:bg-[#F7F5F0] transition-colors"
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