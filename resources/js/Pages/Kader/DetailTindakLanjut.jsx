import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';
import SidebarKader from '../../Components/layout/SidebarKader';
import {
  getAllTindakLanjut,
  INITIAL_TINDAK_LANJUT,
  TINDAK_LANJUT_STORAGE_KEY,
  toSlug,
} from './TindakLanjut';

const formatShortDate = (dateText) => {
  const monthMap = {
    Januari: 'Jan',
    Februari: 'Feb',
    Maret: 'Mar',
    April: 'Apr',
    Mei: 'Mei',
    Juni: 'Jun',
    Juli: 'Jul',
    Agustus: 'Agu',
    September: 'Sep',
    Oktober: 'Okt',
    November: 'Nov',
    Desember: 'Des',
  };

  return dateText.replace(
    /\b(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\b/g,
    (match) => monthMap[match] || match
  );
};

const DetailTindakLanjut = ({ slug }) => {
  const selectedItem = useMemo(() => {
    const allItems = getAllTindakLanjut();
    return (
      allItems.find((item) => toSlug(item.namaAnak) === slug) ||
      INITIAL_TINDAK_LANJUT[0]
    );
  }, [slug]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    namaAnak: selectedItem.namaAnak,
    kondisi: selectedItem.kondisiDetail || selectedItem.kondisiBadge,
    rencana: selectedItem.rencana,
    tanggal: selectedItem.tanggalLengkap || selectedItem.jadwalShort,
    petugas: selectedItem.petugas || 'Bidan Rina',
    catatan: selectedItem.catatan || '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      !formData.namaAnak.trim() ||
      !formData.kondisi.trim() ||
      !formData.rencana.trim() ||
      !formData.tanggal.trim()
    ) {
      setErrorMsg(
        'Mohon lengkapi nama anak, kondisi, rencana tindak lanjut, dan tanggal.'
      );
      return;
    }

    const updatedRecord = {
      id: selectedItem.id || Date.now(),
      namaAnak: formData.namaAnak.trim(),
      kondisiBadge: formData.kondisi.trim(),
      kondisiDetail: formData.kondisi.trim(),
      rencana: formData.rencana.trim(),
      jadwalShort: formatShortDate(formData.tanggal.trim()),
      tanggalLengkap: formData.tanggal.trim(),
      petugas: formData.petugas.trim() || 'Bidan Rina',
      catatan: formData.catatan.trim(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(TINDAK_LANJUT_STORAGE_KEY) || '[]'
      );
      const filtered = existing.filter(
        (item) =>
          toSlug(item.namaAnak) !== slug &&
          toSlug(item.namaAnak) !== toSlug(updatedRecord.namaAnak)
      );
      localStorage.setItem(
        TINDAK_LANJUT_STORAGE_KEY,
        JSON.stringify([updatedRecord, ...filtered])
      );
    } catch {
      // Abaikan jika penyimpanan lokal dibatasi
    }

    setIsEditing(false);
    setIsSaved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
      <SidebarKader />

      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 lg:py-8 max-w-[1200px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-[12.5px] font-medium text-[#334155] flex flex-wrap items-center gap-1"
        >
          <Link
            href="/kader/dashboard"
            className="hover:text-[#2E5780] transition-colors"
          >
            Kader
          </Link>
          <span>/</span>
          <Link
            href="/kader/tindak-lanjut"
            className="hover:text-[#2E5780] transition-colors"
          >
            Tindak Lanjut
          </Link>
          <span>/</span>
          <span className="text-[#1D3B58] font-semibold">
            {formData.namaAnak}
          </span>
        </nav>

        {!isSaved ? (
          <>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
                  Rencana tindak lanjut
                </h1>
                <p className="mt-1 text-[14px] text-[#475569]">
                  Pantau kebutuhan dan tindak lanjut balita.
                </p>
              </div>

              {isEditing && (
                <span className="bg-[#D6E8F8] text-[#1D3B58] text-[12.5px] font-bold px-4 py-1.5 rounded-full">
                  Mode Edit Aktif
                </span>
              )}
            </div>

            {/* Kartu Form Detail Tindak Lanjut */}
            <section className="mt-6 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1D3B58] mb-5">
                Tindak Lanjut
              </h2>

              {errorMsg && (
                <div className="mb-5 rounded-[14px] bg-orange-50 border border-[#F3831E]/40 px-4 py-3 text-[13.5px] font-medium text-[#9A3412]">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {/* Nama Anak */}
                <div>
                  <label
                    htmlFor="detailNamaAnak"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Nama Anak
                  </label>
                  <input
                    id="detailNamaAnak"
                    type="text"
                    readOnly={!isEditing}
                    value={formData.namaAnak}
                    onChange={(e) => handleChange('namaAnak', e.target.value)}
                    className={`w-full border rounded-[14px] px-4 py-3 text-[14.5px] font-medium transition-colors ${
                      isEditing
                        ? 'bg-white border-[#2E5780] text-[#1E293B] focus:outline-none'
                        : 'bg-white border-slate-300/90 text-[#1E293B]'
                    }`}
                  />
                </div>

                {/* Kondisi */}
                <div>
                  <label
                    htmlFor="detailKondisi"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Kondisi
                  </label>
                  <input
                    id="detailKondisi"
                    type="text"
                    readOnly={!isEditing}
                    value={formData.kondisi}
                    onChange={(e) => handleChange('kondisi', e.target.value)}
                    className={`w-full border rounded-[14px] px-4 py-3 text-[14.5px] font-medium transition-colors ${
                      isEditing
                        ? 'bg-white border-[#2E5780] text-[#1E293B] focus:outline-none'
                        : 'bg-white border-slate-300/90 text-[#1E293B]'
                    }`}
                  />
                </div>

                {/* Rencana Tindak Lanjut */}
                <div>
                  <label
                    htmlFor="detailRencana"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Rencana Tindak Lanjut
                  </label>
                  <input
                    id="detailRencana"
                    type="text"
                    readOnly={!isEditing}
                    value={formData.rencana}
                    onChange={(e) => handleChange('rencana', e.target.value)}
                    className={`w-full border rounded-[14px] px-4 py-3 text-[14.5px] font-medium transition-colors ${
                      isEditing
                        ? 'bg-white border-[#2E5780] text-[#1E293B] focus:outline-none'
                        : 'bg-white border-slate-300/90 text-[#1E293B]'
                    }`}
                  />
                </div>

                {/* Tanggal & Petugas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="detailTanggal"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Tanggal
                    </label>
                    <div className="relative">
                      <input
                        id="detailTanggal"
                        type="text"
                        readOnly={!isEditing}
                        value={formData.tanggal}
                        onChange={(e) =>
                          handleChange('tanggal', e.target.value)
                        }
                        className={`w-full border rounded-[14px] pl-4 pr-11 py-3 text-[14.5px] font-medium transition-colors ${
                          isEditing
                            ? 'bg-white border-[#2E5780] text-[#1E293B] focus:outline-none'
                            : 'bg-white border-slate-300/90 text-[#1E293B]'
                        }`}
                      />
                      <Calendar className="w-5 h-5 text-[#475569] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="detailPetugas"
                      className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                    >
                      Petugas
                    </label>
                    <input
                      id="detailPetugas"
                      type="text"
                      readOnly={!isEditing}
                      value={formData.petugas}
                      onChange={(e) => handleChange('petugas', e.target.value)}
                      className={`w-full border rounded-[14px] px-4 py-3 text-[14.5px] font-medium transition-colors ${
                        isEditing
                          ? 'bg-white border-[#2E5780] text-[#1E293B] focus:outline-none'
                          : 'bg-white border-slate-300/90 text-[#1E293B]'
                      }`}
                    />
                  </div>
                </div>

                {/* Catatan (opsional) */}
                <div>
                  <label
                    htmlFor="detailCatatan"
                    className="block text-[13.5px] font-bold text-[#1D3B58] mb-2"
                  >
                    Catatan (opsional)
                  </label>
                  <textarea
                    id="detailCatatan"
                    rows={3}
                    readOnly={!isEditing}
                    value={formData.catatan}
                    onChange={(e) => handleChange('catatan', e.target.value)}
                    className={`w-full border rounded-[14px] px-4 py-3 text-[14.5px] font-medium resize-none transition-colors ${
                      isEditing
                        ? 'bg-white border-[#2E5780] text-[#1E293B] focus:outline-none'
                        : 'bg-white border-slate-300/90 text-[#1E293B]'
                    }`}
                  />
                </div>

                {/* Tombol Edit & Simpan data */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="w-full bg-white hover:bg-slate-50 text-[#1D3B58] text-[15px] font-bold py-3.5 px-6 rounded-full border border-[#2E5780]/70 transition-colors duration-200 cursor-pointer"
                  >
                    {isEditing ? 'Selesai edit' : 'Edit'}
                  </button>

                  <button
                    type="submit"
                    className="w-full bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold py-3.5 px-6 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    Simpan data
                  </button>
                </div>
              </form>
            </section>
          </>
        ) : (
          /* ================= KONFIRMASI TERSIMPAN ================= */
          <div className="mt-3">
            <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1D3B58] tracking-tight leading-tight">
              Tindak lanjut telah disimpan.
            </h1>

            <div className="mt-5 bg-[#B5D5F0] rounded-[16px] px-6 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[#1D3B58] min-h-[84px] flex flex-col justify-center">
              <p className="text-[13px] font-medium leading-relaxed">
                Jadwal tersimpan di daftar tindak lanjut dan siap dipantau
                menjelang hari konsultasi.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.visit('/kader/tindak-lanjut')}
                className="bg-[#2E5780] hover:bg-[#234466] text-white text-[15px] font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <span>Lihat tindak lanjut</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DetailTindakLanjut;