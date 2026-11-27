import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import Logo from '@/Assets/images/Logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePage().url.split('?')[0].split('#')[0];

  const isLandingPage = pathname === '/';

  // Menu untuk Beranda Publik
  const landingNavItems = [
    { label: 'Beranda', to: '/' },
    { label: 'Pertumbuhan', to: '/ortu/pertumbuhan' },
    { label: 'Jadwal', to: '/ortu/jadwal-posyandu' },
    { label: 'Edukasi', to: '/edukasi' },
  ];

  // Menu untuk halaman Auth / Publik lainnya
  const defaultNavItems = [
    { label: 'Layanan', to: '/#layanan' },
    { label: 'Cara Kerja', to: '/#cara-kerja' },
    { label: 'Edukasi', to: '/edukasi' },
    { label: 'Tentang Kami', to: '/#tentang-kami' },
  ];

  const navItems = isLandingPage ? landingNavItems : defaultNavItems;

  // Pengganti NavLink React Router: penanda menu aktif
  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);

  // Samakan lebar container navbar dengan container konten di bawahnya
  const containerWidthClass = isLandingPage
    ? 'max-w-[1160px] px-5 sm:px-8 py-3.5'
    : 'max-w-[1080px] px-6 py-3';

  return (
    <header className="w-full pt-5 px-4 sm:px-6 lg:px-8">
      <nav
        className={`${containerWidthClass} mx-auto bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 flex items-center justify-between transition-all`}
      >
        {/* Kiri: Logo + Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src={Logo}
            alt="Logo Posyanduku"
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-[19px] font-bold tracking-tight text-[#315B87]">
            Posyanduku
          </span>
        </Link>

        {/* Tengah: Menu Desktop */}
        <div className="hidden md:flex items-center gap-10 lg:gap-12">
          {navItems.map((item) =>
            item.to.startsWith('/#') ? (
              <a
                key={item.label}
                href={item.to}
                className="py-1 text-[14px] font-semibold text-[#475569] hover:text-[#315B87] transition-colors duration-200"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                href={item.to}
                className={
                  `relative py-1 text-[14px] font-semibold transition-colors duration-200 ${
                    isActive(item.to)
                      ? 'text-[#1D3B58] after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-[#315B87] after:rounded-full'
                      : 'text-[#475569] hover:text-[#315B87]'
                  }`
                }
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Kanan: Tombol Masuk */}
        <div className="hidden md:flex items-center">
          <Link
            href={route('login')}
            className="bg-[#315B87] hover:bg-[#234466] text-white text-[14px] font-semibold px-7 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow"
          >
            Masuk
          </Link>
        </div>

        {/* Hamburger Menu Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-full text-[#1D3B58] hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Dropdown Mobile */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden mx-auto mt-2 bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col gap-3 ${
            isLandingPage ? 'max-w-[1160px]' : 'max-w-[1080px]'
          }`}
        >
          {navItems.map((item) =>
            item.to.startsWith('/#') ? (
              <a
                key={item.label}
                href={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#475569] hover:bg-slate-50 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  `px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(item.to)
                      ? 'bg-[#C5E3FA]/50 text-[#1D3B58]'
                      : 'text-[#475569] hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href={route('login')}
            onClick={() => setMobileMenuOpen(false)}
            className="mt-1 w-full text-center bg-[#315B87] hover:bg-[#234466] text-white text-sm font-semibold py-3 rounded-full transition-colors"
          >
            Masuk
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;