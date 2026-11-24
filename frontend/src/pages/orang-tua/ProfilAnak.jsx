import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarOrtu from '../../components/layout/NavbarOrtu';
import ibuAnakImg from '../../assets/images/ibu-anak-login.png';

// Data awal profil anak (sementara sebelum terhubung ke API Laravel GET /api/ortu/balita/:id)
const INITIAL_CHILD_DATA = {
  namaLengkap: 'Aruna Putri',
  namaPanggilan: 'Aruna',
  tanggalLahir: '15 Mei 2025',
  jenisKelamin: 'Perempuan',
  orangTuaWali: 'Nadia Putri',
  kodePosyandu: 'PSYND102',
  namaPosyandu: 'Posyandu Melati 01',
  usiaTeks: '18 bulan',
};

export default function ProfilAnak() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_CHILD_DATA);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.namaLengkap.trim() || !formData.kodePosyandu.trim()) {
      setErrorMessage('Nama lengkap anak dan kode posyandu wajib diisi.');
      return;
    }

    // Sementara sebelum terhubung ke API Laravel (PUT /api/ortu/balita/:id)
    console.log('Profil anak diperbarui:', formData);
    navigate('/ortu/profil-anak/konfirmasi', {
      state: {
        namaLengkap: formData.namaLengkap,
        namaPanggilan: formData.namaPanggilan || formData.namaLengkap.split(' ')[0],
        usiaTeks: formData.usiaTeks || '18 bulan',
        namaPosyandu: formData.namaPosyandu || 'Posyandu Melati 01',
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-14">
      {/* Floating Navbar Orang Tua */}
      <NavbarOrtu />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <section className="bg-white rounded-[28px] p-7 sm:p-11 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {/* Header Kartu */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-[32px] font-bold text-[#2E5780] tracking-tight">
              Profil Anak
            </h1>

            <Link
              to="/ortu/tambah-anak"
              className="text-xs font-semibold text-[#2E5780] border border-[#2E5780]/40 hover:bg-[#F7F5F0] px-4 py-2 rounded-full transition-colors"
            >
              + Tambah Profil Anak
            </Link>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Grid 2 Kolom: Foto Kiri & Form Data Anak Kanan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-6 items-center">
            {/* Kolom Kiri: Kartu Foto Ibu & Anak */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-[260px] aspect-[3/4] rounded-[22px] bg-gradient-to-b from-[#E5F0FA] via-[#CBE0F5] to-[#A4C6E8] overflow-hidden flex items-end justify-center shadow-[0_4px_16px_rgba(46,87,128,0.08)]">
                <img
                  src={ibuAnakImg}
                  alt="Profil Ibu dan Anak"
                  className="w-full h-full object-cover object-top select-none"
                />
              </div>
            </div>

            {/* Kolom Kanan: Formulir Data Anak */}
            <form onSubmit={handleSubmit} className="lg:col-span-8">
              <h2 className="text-lg sm:text-[21px] font-bold text-[#F3831E] tracking-tight">
                Data anak
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 mt-4">
                {/* Nama Lengkap */}
                <div>
                  <label
                    htmlFor="namaLengkap"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Nama lengkap
                  </label>
                  <input
                    id="namaLengkap"
                    name="namaLengkap"
                    type="text"
                    required
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-slate-600 focus:text-[#1E293B] focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>

                {/* Nama Panggilan */}
                <div>
                  <label
                    htmlFor="namaPanggilan"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Nama Panggilan
                  </label>
                  <input
                    id="namaPanggilan"
                    name="namaPanggilan"
                    type="text"
                    required
                    value={formData.namaPanggilan}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-slate-600 focus:text-[#1E293B] focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label
                    htmlFor="tanggalLahir"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Tanggal lahir
                  </label>
                  <input
                    id="tanggalLahir"
                    name="tanggalLahir"
                    type="text"
                    required
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-slate-600 focus:text-[#1E293B] focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label
                    htmlFor="jenisKelamin"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    id="jenisKelamin"
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-slate-600 focus:text-[#1E293B] focus:outline-none focus:border-[#2E5780] transition-colors"
                  >
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>

                {/* Orang tua / wali (Full Width) */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="orangTuaWali"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Orang tua / wali
                  </label>
                  <input
                    id="orangTuaWali"
                    name="orangTuaWali"
                    type="text"
                    required
                    value={formData.orangTuaWali}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-slate-600 focus:text-[#1E293B] focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>

                {/* Kode Posyandu (Full Width) */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="kodePosyandu"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Kode Posyandu
                  </label>
                  <input
                    id="kodePosyandu"
                    name="kodePosyandu"
                    type="text"
                    required
                    value={formData.kodePosyandu}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-slate-600 focus:text-[#1E293B] focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>
              </div>

              {/* Tombol Simpan Profil */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-[13px] font-semibold px-9 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}