import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="w-full pt-6 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-6xl mx-auto bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#2E5780] shrink-0" />
          <span className="text-xl font-bold tracking-tight text-[#1D3B58]">
            Posyanduku
          </span>
        </Link>

        {/* Menu Navigasi Tengah */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1D3B58]">
          <li>
            <Link to="/#layanan" className="hover:text-[#2E5780] transition-colors">
              Layanan
            </Link>
          </li>
          <li>
            <Link to="/#cara-kerja" className="hover:text-[#2E5780] transition-colors">
              Cara Kerja
            </Link>
          </li>
          <li>
            <Link to="/edukasi" className="hover:text-[#2E5780] transition-colors">
              Edukasi
            </Link>
          </li>
          <li>
            <Link to="/#tentang-kami" className="hover:text-[#2E5780] transition-colors">
              Tentang Kami
            </Link>
          </li>
        </ul>

        {/* Tombol Masuk */}
        <Link
          to="/login"
          className="bg-[#2E5780] hover:bg-[#234466] text-white text-sm font-semibold px-7 py-2.5 rounded-full transition-colors"
        >
          Masuk
        </Link>
      </nav>
    </header>
  );
}