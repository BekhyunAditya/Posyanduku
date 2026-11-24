import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarOrtu from '../../components/layout/NavbarOrtu';
import ibuAnakImg from '../../assets/images/ibu-anak-login.png';

export default function TambahProfilAnak() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaPanggilan: '',
    tanggalLahir: '',
    jenisKelamin: '',
    orangTuaWali: '',
    kodePosyandu: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  // Hitung perkiraan usia dalam bulan dari input tanggal lahir
  const calculateAgeLabel = (birthDateStr) => {
    if (!birthDateStr) return '18 bulan';
    const birthDate = new Date(birthDateStr);
    if (Number.isNaN(birthDate.getTime())) return '18 bulan';

    const now = new Date();
    const months =
      (now.getFullYear() - birthDate.getFullYear()) * 12 +
      (now.getMonth() - birthDate.getMonth());
    return `${Math.max(0, months)} bulan`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.jenisKelamin) {
      setErrorMessage('Silakan pilih jenis kelamin anak terlebih dahulu.');
      return;
    }

    // Sementara sebelum terhubung ke API Laravel (POST /api/ortu/balita)
    console.log('Menambahkan profil anak baru:', formData);
    navigate('/ortu/profil-anak/konfirmasi', {
      state: {
        namaLengkap: formData.namaLengkap,
        namaPanggilan:
          formData.namaPanggilan.trim() || formData.namaLengkap.trim().split(' ')[0],
        usiaTeks: calculateAgeLabel(formData.tanggalLahir),
        namaPosyandu: 'Posyandu Melati 01',
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
          {/* Judul Utama */}
          <h1 className="text-2xl sm:text-[31px] font-bold text-[#2E5780] tracking-tight">
            Tambahkan profil anak untuk Posyanduku
          </h1>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Grid 2 Kolom: Foto Kiri & Form Profil Baru Kanan */}
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

            {/* Kolom Kanan: Formulir Profil Baru */}
            <form onSubmit={handleSubmit} className="lg:col-span-8">
              <h2 className="text-lg sm:text-[21px] font-bold text-[#F3831E] tracking-tight">
                Profil Baru
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
                    placeholder="Masukkan nama anak"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
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
                    value={formData.namaPanggilan}
                    onChange={handleChange}
                    placeholder="Aruna"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
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
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    required
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    placeholder="Pilih tanggal"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
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
                    required
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm focus:outline-none focus:border-[#2E5780] transition-colors ${
                      formData.jenisKelamin ? 'text-[#1E293B]' : 'text-slate-400'
                    }`}
                  >
                    <option value="" disabled>
                      Pilih jenis kelamin
                    </option>
                    <option value="Perempuan" className="text-[#1E293B]">
                      Perempuan
                    </option>
                    <option value="Laki-laki" className="text-[#1E293B]">
                      Laki-laki
                    </option>
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
                    placeholder="Masukkan nama orang tua"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
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
                    placeholder="Masukkan kode dari kader"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-400/70 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
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