import { Link, router } from "@inertiajs/react";
import NavbarOrtu from "@/Components/layout/NavbarOrtu";
import { EDUKASI_CATEGORIES, EDUKASI_ARTICLES } from "@/data/edukasiData";
import fallbackIbuAnakImg from "@/Assets/images/ibu-anak-login.png";

export default function DetailEdukasi({ slug }) {
    const article =
        EDUKASI_ARTICLES.find((item) => item.slug === slug) ||
        EDUKASI_ARTICLES[0];

    const handleCategoryClick = (category) => {
        if (category === "Semua Topik") {
            router.visit("/edukasi");
        } else {
            router.visit(`/edukasi?topik=${encodeURIComponent(category)}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
            {/* Floating Navbar Orang Tua */}
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
                        const isActive = category === article.filterTopik;
                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryClick(category)}
                                className={`px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-[#2E5780] text-white shadow-[0_2px_10px_rgba(46,87,128,0.2)]"
                                        : "bg-white text-[#1D3B58] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:bg-slate-50"
                                }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {/* Kartu Putih Detail Artikel */}
                <article className="bg-white rounded-[28px] p-6 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-6">
                    {/* Gambar Banner Lebar Resolusi Penuh */}
                    <div className="w-full h-56 sm:h-72 lg:h-[320px] rounded-2xl bg-[#E8F1F8] overflow-hidden">
                        <img
                            src={article.bannerImage || article.image}
                            alt={article.judul}
                            onError={(e) => {
                                e.currentTarget.src = fallbackIbuAnakImg;
                            }}
                            className="w-full h-full object-cover object-[center_25%] select-none"
                        />
                    </div>

                    {/* Grid 2 Kolom di Bawah Gambar */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-stretch">
                        {/* Kolom Kiri: Kategori, Judul, Ringkasan, & Tombol Kembali */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                            <div>
                                <span className="text-xs sm:text-sm font-bold text-[#F3831E]">
                                    {article.kategori}
                                </span>

                                <h2 className="text-2xl sm:text-[28px] font-bold text-[#2E5780] leading-[1.26] tracking-tight mt-2">
                                    {article.judul}
                                </h2>

                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-3">
                                    {article.ringkasan}
                                </p>
                            </div>

                            <div className="mt-8 lg:mt-10">
                                <Link
                                    href="/edukasi"
                                    className="inline-flex items-center justify-center bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-10 py-2.5 rounded-full transition-colors"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>

                        {/* Kolom Kanan: Kartu Poin Bernomor (01, 02) & Penutup */}
                        <div className="lg:col-span-7 space-y-4">
                            {article.steps.map((step) => (
                                <div
                                    key={step.number}
                                    className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.05)] border border-slate-100/90"
                                >
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-lg sm:text-[20px] font-bold text-[#2E5780]">
                                            {step.number}
                                        </span>
                                        <h3 className="text-sm sm:text-[15px] font-bold text-[#F3831E]">
                                            {step.title}
                                        </h3>
                                    </div>

                                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed mt-2">
                                        {step.description}
                                    </p>
                                </div>
                            ))}

                            {/* Paragraf Penutup Bawah */}
                            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed pt-2">
                                {article.closingNote}
                            </p>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
