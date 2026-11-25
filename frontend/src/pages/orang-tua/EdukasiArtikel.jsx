import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NavbarOrtu from '../../components/layout/NavbarOrtu';
import { EDUKASI_CATEGORIES, EDUKASI_ARTICLES } from '../../data/edukasiData';
import fallbackIbuAnakImg from '../../assets/images/ibu-dan-anak.png';

export default function EdukasiArtikel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopic = searchParams.get('topik') || 'Semua Topik';
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);

  useEffect(() => {
    const topikParam = searchParams.get('topik');
    if (topikParam && EDUKASI_CATEGORIES.includes(topikParam)) {
      setSelectedTopic(topikParam);
    }
  }, [searchParams]);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    if (topic === 'Semua Topik') {
      setSearchParams({});
    } else {
      setSearchParams({ topik: topic });
    }
  };

  // Artikel utama (hero) ditampilkan saat "Semua Topik" aktif
  const featuredArticle =
    selectedTopic === 'Semua Topik'
      ? EDUKASI_ARTICLES.find((item) => item.featured)
      : null;

  // Daftar artikel grid di bawah
  const gridArticles =
    selectedTopic === 'Semua Topik'
      ? EDUKASI_ARTICLES.filter(
          (item) =>
            !item.featured &&
            (item.filterTopik === 'Mpasi' || item.filterTopik === 'Gizi Terjangkau')
        )
      : EDUKASI_ARTICLES.filter((item) => item.filterTopik === selectedTopic);

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua (Menu "Edukasi" otomatis aktif) */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Judul Halaman */}
        <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
          Edukasi untuk si kecil
        </h1>

        {/* Baris Filter Kategori */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-4">
          {EDUKASI_CATEGORIES.map((category) => {
            const isActive = selectedTopic === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleSelectTopic(category)}
                className={`px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2E5780] text-white shadow-[0_2px_10px_rgba(46,87,128,0.2)]'
                    : 'bg-white text-[#1D3B58] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Kartu Artikel Utama (Featured) */}
        {featuredArticle && (
          <article className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-6 flex flex-col md:flex-row items-center gap-6 sm:gap-9">
            {/* Gambar Kiri */}
            <div className="w-full md:w-[310px] lg:w-[340px] h-56 sm:h-64 rounded-2xl bg-[#E8F1F8] overflow-hidden shrink-0">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.judul}
                onError={(e) => {
                  e.currentTarget.src = fallbackIbuAnakImg;
                }}
                className="w-full h-full object-cover object-center select-none"
              />
            </div>

            {/* Konten Kanan */}
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-xs sm:text-sm font-bold text-[#F3831E]">
                {featuredArticle.kategori}
              </span>

              <h2 className="text-2xl sm:text-[28px] font-bold text-[#2E5780] leading-[1.25] tracking-tight mt-2">
                {featuredArticle.judul}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-3 max-w-md">
                {featuredArticle.ringkasan}
              </p>

              <div className="mt-6">
                <Link
                  to={`/edukasi/${featuredArticle.slug}`}
                  className="inline-flex items-center justify-center bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-7 py-2.5 rounded-full transition-colors"
                >
                  {featuredArticle.ctaText}
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* Grid Kartu Artikel di Bawah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {gridArticles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-5"
            >
              {/* Thumbnail Vertikal Kiri */}
              <div className="w-28 sm:w-36 h-44 sm:h-48 rounded-2xl bg-[#E8F1F8] overflow-hidden shrink-0">
                <img
                  src={article.image}
                  alt={article.judul}
                  onError={(e) => {
                    e.currentTarget.src = fallbackIbuAnakImg;
                  }}
                  className="w-full h-full object-cover object-center select-none"
                />
              </div>

              {/* Informasi Artikel Kanan */}
              <div className="flex-1 flex flex-col justify-between min-h-[168px]">
                <div>
                  <span className="text-xs font-bold text-[#F3831E]">
                    {article.kategori}
                  </span>

                  <h3 className="text-lg sm:text-[20px] font-bold text-[#2E5780] leading-snug tracking-tight mt-1.5">
                    {article.judul}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-2">
                    {article.ringkasan}
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/edukasi/${article.slug}`}
                    className="inline-flex items-center justify-center bg-[#2E5780] hover:bg-[#234466] text-white text-xs font-semibold px-6 py-2 rounded-full transition-colors"
                  >
                    {article.ctaText}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}