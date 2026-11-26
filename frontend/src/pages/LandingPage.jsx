import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

import Logo from '../assets/images/Logo.png';
import HeroMotherChild from '../assets/images/ibu-anak-login.png';
import EdukasiBalitaImg from '../assets/images/edukasi-balita.png';
import BannerBayiImg from '../assets/images/banner-bayi.png';
import IbuDanAnakImg from '../assets/images/ibu-dan-anak.png';
import CatatanKonsulImg from '../assets/images/catatan-Konsul.png';

const TYPING_PHRASES = ['Mudah Memantau', 'Tenang Mendampingi'];

const LandingPage = () => {
  // State untuk animasi ketikan Hero (komentar UI/UX)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(TYPING_PHRASES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex];
    let timer;

    if (!isDeleting && displayedText === currentPhrase) {
      // Jeda saat kalimat selesai diketik
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && displayedText === '') {
      // Beralih ke kalimat berikutnya setelah selesai dihapus
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
    } else {
      // Kecepatan mengetik vs menghapus
      const speed = isDeleting ? 45 : 80;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentPhrase.slice(0, displayedText.length - 1)
          : currentPhrase.slice(0, displayedText.length + 1);
        setDisplayedText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex]);

  const layananList = [
    {
      number: '1.',
      title: 'Pantau Pertumbuhan',
      description: 'Lihat perjalanan berat dan tinggi anak',
      image: EdukasiBalitaImg,
      to: '/ortu/pertumbuhan',
    },
    {
      number: '2.',
      title: 'Jadwal & Imunisasi',
      description: 'Persiapan kunjungan berikutnya',
      image: BannerBayiImg,
      to: '/ortu/imunisasi',
    },
    {
      number: '3.',
      title: 'Panduan Keluarga',
      description: 'Langkah sederhana yang bisa diikuti',
      image: IbuDanAnakImg,
      to: '/ortu/panduan-kunjungan',
    },
    {
      number: '4.',
      title: 'Buku Pendamping',
      description: 'Riwayat layanan dalam satu ringkasan',
      image: CatatanKonsulImg,
      to: '/ortu/buku-kia',
    },
  ];

  const langkahList = [
    {
      step: '01',
      title: 'Daftarkan Anak',
      description: 'Lengkapi profil dan hubungkan ke posyandu',
    },
    {
      step: '02',
      title: 'Ikuti Kunjungan di rumah',
      description: 'Kader mencatat pengukuran dan pelayanan',
    },
    {
      step: '03',
      title: 'Dampingi di rumah',
      description: 'Lihat riwayat, pengingat, dan arahan berikutnya',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1224px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-16 space-y-8">
        {/* ================= SECTION 1: HERO ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Kartu Putih Kiri */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-7 sm:p-10 lg:p-11 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <span className="inline-block text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.08em] text-[#F3831E] mb-3">
                BERSAMA DI SETIAP TAHAP
              </span>

              <h1 className="text-[32px] sm:text-[42px] lg:text-[44px] font-extrabold text-[#2E5780] leading-[1.18] tracking-tight">
                Posyanduku Lebih
                <span className="block min-h-[1.25em] text-[#2E5780]">
                  {displayedText}
                  <span
                    className="inline-block w-[3px] h-[0.9em] ml-1 align-middle bg-[#F3831E] animate-pulse"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              <p className="mt-4 text-[14px] sm:text-[15px] text-[#475569] leading-relaxed max-w-[490px]">
                Catat tumbuh kembang, ikuti jadwal posyandu, dan temukan panduan
                untuk langkah kecil si buah hati
              </p>

              {/* Tombol CTA */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/register"
                  className="bg-[#F3831E] hover:bg-[#e07414] text-white text-[14px] font-semibold px-7 py-3.5 rounded-full shadow-[0_6px_18px_rgba(243,131,30,0.28)] hover:shadow-[0_8px_22px_rgba(243,131,30,0.36)] transition-all duration-200"
                >
                  Mulai Dampingi Anak
                </Link>
                <a
                  href="#layanan"
                  className="bg-[#F7F5F0] hover:bg-[#ECE8DF] text-[#1D3B58] border border-slate-200/80 text-[14px] font-semibold px-7 py-3.5 rounded-full transition-colors duration-200"
                >
                  Kenali Anak
                </a>
              </div>
            </div>

            {/* 3 Poin Sorotan Bawah */}
            <div className="mt-9 pt-6 border-t border-slate-100 grid grid-cols-3 gap-3 sm:gap-6">
              <div className="pr-2 border-r border-[#F39C4F]/40">
                <p className="text-[#F3831E] font-extrabold text-base sm:text-lg">
                  01
                </p>
                <p className="mt-1 text-[#1D3B58] font-bold text-xs sm:text-[13px] leading-snug">
                  Riwayat
                  <br />
                  Terhubung
                </p>
              </div>

              <div className="px-1 sm:px-2 border-r border-[#F39C4F]/40">
                <p className="text-[#F3831E] font-extrabold text-base sm:text-lg">
                  02
                </p>
                <p className="mt-1 text-[#1D3B58] font-bold text-xs sm:text-[13px] leading-snug">
                  Jadwal
                  <br />
                  Lebih teratur
                </p>
              </div>

              <div className="pl-1 sm:pl-2">
                <p className="text-[#F3831E] font-extrabold text-base sm:text-lg">
                  03
                </p>
                <p className="mt-1 text-[#1D3B58] font-bold text-xs sm:text-[13px] leading-snug">
                  Panduan
                  <br />
                  Praktis
                </p>
              </div>
            </div>
          </div>

          {/* Kartu Foto Kanan */}
          <div className="lg:col-span-5 rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-[#B5D5F0] min-h-[340px] sm:min-h-[420px] relative">
            <img
              src={HeroMotherChild}
              alt="Ibu menggendong balita dengan ceria"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </section>

        {/* ================= SECTION 2: LAYANAN ================= */}
        <section
          id="layanan"
          className="scroll-mt-24 bg-white rounded-[28px] p-7 sm:p-10 lg:p-11 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#2E5780] leading-[1.2]">
              Satu Tempat,
              <br />
              Banyak bentuk perhatian
            </h2>
            <p className="text-[14px] text-[#475569] leading-relaxed max-w-[380px]">
              Kenali layanan yang membantu keluarga memantau dan mendampingi
              anak setiap bulan.
            </p>
          </div>

          {/* Grid 4 Kartu dengan Animasi Zoom-In saat Hover (komentar UI/UX) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {layananList.map((item) => (
              <div
                key={item.number}
                className="group relative h-[285px] sm:h-[300px] rounded-[22px] overflow-hidden shadow-sm hover:shadow-[0_14px_30px_rgba(29,59,88,0.18)] transition-all duration-300"
              >
                {/* Gambar Latar dengan Zoom-In Halus */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
                />

                {/* Overlay Gelap agar Teks Kontras */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75 group-hover:from-black/60 group-hover:to-black/80 transition-colors duration-300" />

                {/* Konten Kartu */}
                <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[34px] font-extrabold text-[#F3831E] leading-none">
                        {item.number}
                      </span>
                      <h3 className="text-[17px] font-bold text-white leading-snug pt-0.5">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-4 text-[12.5px] text-white/90 text-center leading-relaxed px-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Tombol Jelajahi */}
                  <div className="pt-2">
                    <Link
                      to={item.to}
                      className="w-full bg-white/95 hover:bg-white text-[#1D3B58] text-[13px] font-bold py-2.5 px-4 rounded-full inline-flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 group-hover:shadow"
                    >
                      <span>jelajahi</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 3: CARA KERJA ================= */}
        <section
          id="cara-kerja"
          className="scroll-mt-24 bg-[#F3831E] rounded-[28px] overflow-hidden shadow-[0_8px_28px_rgba(243,131,30,0.2)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Kolom Kiri: Judul + Foto */}
            <div className="lg:col-span-5 pt-8 px-7 sm:pt-10 sm:px-10 flex flex-col justify-between">
              <h2 className="text-[26px] sm:text-[31px] font-extrabold text-white leading-[1.22]">
                Mulai dari hal yang sederhana
              </h2>

              <div className="mt-6 flex justify-center lg:justify-start">
                <img
                  src={IbuDanAnakImg}
                  alt="Orang tua mendampingi anak"
                  className="w-full max-w-[300px] h-[250px] sm:h-[275px] object-cover object-top rounded-t-[24px] shadow-md"
                />
              </div>
            </div>

            {/* Kolom Kanan: 3 Langkah Kartu Putih */}
            <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-center gap-4">
              {langkahList.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[20px] font-extrabold text-[#2E5780]">
                      {item.step}
                    </span>
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#F3831E]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-[#334155] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ================= SECTION 4: FOOTER ================= */}
      <footer id="tentang-kami" className="bg-[#2E5780] text-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
            {/* Kolom 1: Brand */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
                  <img
                    src={Logo}
                    alt="Logo Posyanduku"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[20px] font-bold tracking-tight text-white">
                  Posyanduku
                </span>
              </Link>
              <p className="mt-3.5 text-[13px] text-white/80 leading-relaxed">
                Lebih Mudah Memantau,
                <br />
                Lebih Tenang Mendampingi.
              </p>
            </div>

            {/* Kolom 2: Kesehatan anak */}
            <div className="lg:col-span-2">
              <h4 className="text-[13.5px] font-bold text-white mb-3">
                Kesehatan anak
              </h4>
              <ul className="space-y-2 text-[12.5px] text-white/80">
                <li>
                  <Link
                    to="/ortu/pertumbuhan"
                    className="hover:text-white transition-colors"
                  >
                    Pantau pertumbuhan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ortu/imunisasi"
                    className="hover:text-white transition-colors"
                  >
                    Jadwal imunisasi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ortu/jadwal-posyandu"
                    className="hover:text-white transition-colors"
                  >
                    Kalender kegiatan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Panduan keluarga */}
            <div className="lg:col-span-2">
              <h4 className="text-[13.5px] font-bold text-white mb-3">
                Panduan keluarga
              </h4>
              <ul className="space-y-2 text-[12.5px] text-white/80">
                <li>
                  <Link
                    to="/ortu/panduan-tindakan"
                    className="hover:text-white transition-colors"
                  >
                    Panduan tindakan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ortu/buku-kia"
                    className="hover:text-white transition-colors"
                  >
                    Buku KIA digital
                  </Link>
                </li>
                <li>
                  <Link
                    to="/edukasi"
                    className="hover:text-white transition-colors"
                  >
                    Artikel edukasi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Jelajahi */}
            <div className="lg:col-span-2">
              <h4 className="text-[13.5px] font-bold text-white mb-3">
                Jelajahi
              </h4>
              <ul className="space-y-2 text-[12.5px] text-white/80">
                <li>
                  <a
                    href="#layanan"
                    className="hover:text-white transition-colors"
                  >
                    Layanan Posyanduku
                  </a>
                </li>
                <li>
                  <a
                    href="#cara-kerja"
                    className="hover:text-white transition-colors"
                  >
                    Cara kerja
                  </a>
                </li>
              </ul>
            </div>

            {/* Kolom 5: Akun keluarga */}
            <div className="lg:col-span-2">
              <h4 className="text-[13.5px] font-bold text-white mb-3">
                Akun keluarga
              </h4>
              <div className="flex flex-col items-start gap-2.5">
                <Link
                  to="/login"
                  className="bg-white hover:bg-slate-100 text-[#2E5780] text-[12.5px] font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Masuk ke akun</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/register"
                  className="text-[12.5px] text-white/85 hover:text-white transition-colors pl-1"
                >
                  Daftar orang tua
                </Link>
              </div>
            </div>
          </div>

          {/* Garis Bawah & Copyright */}
          <div className="mt-10 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/75">
            <p>© 2026 Posyanduku</p>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span>Kembali ke atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;