import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Calendar, BookOpen, Heart, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

const FEATURES = [
  {
    icon: BarChart3,
    text: 'Pantau Riwayat Tumbuh Kembang',
  },
  {
    icon: Calendar,
    text: 'Pantau Riwayat Tumbuh Kembang',
  },
  {
    icon: BookOpen,
    text: 'Pantau Riwayat Tumbuh Kembang',
  },
  {
    icon: Heart,
    text: 'Pantau Riwayat Tumbuh Kembang',
  },
];

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nomorTelepon: '',
    email: '',
    posyanduTerdekat: '',
    kataSandi: '',
    konfirmasiKataSandi: '',
    setujuPrivasi: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi wajib centang kebijakan privasi
    if (!formData.setujuPrivasi) {
      setErrorMessage('Anda harus menyetujui kebijakan privasi terlebih dahulu untuk membuat akun.');
      return;
    }

    // Validasi kata sandi minimal 8 karakter kombinasi huruf dan angka
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{8,}$/;
    if (!passwordRegex.test(formData.kataSandi)) {
      setErrorMessage('Kata sandi harus minimal 8 karakter dengan kombinasi huruf dan angka.');
      return;
    }

    if (formData.kataSandi !== formData.konfirmasiKataSandi) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Sementara sebelum terhubung ke API Laravel:
    console.log('Data registrasi orang tua:', formData);
    alert('Akun keluarga berhasil dibuat! Silakan masuk untuk menambahkan profil anak.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-12">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Kolom Kiri: Panel Informasi & Langkah Registrasi */}
          <aside className="lg:col-span-5 bg-[#2E5780] rounded-[24px] p-7 sm:p-8 text-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-white/85">
              Registrasi orang tua
            </p>
            <h1 className="text-2xl sm:text-[26px] font-bold leading-[1.28] tracking-tight mt-1.5">
              Mulai catatan tumbuh kembang anak Anda
            </h1>

            {/* Stepper 1 - 2 - 3 */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Langkah 1 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-white/15 text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-snug">Data orang tua</p>
                    <p className="text-[10px] text-white/75 leading-tight mt-0.5">
                      Nama, telepon, dan email
                    </p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-white/15 text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-snug">Keamanan akun</p>
                    <p className="text-[10px] text-white/75 leading-tight mt-0.5">
                      Buat kata sandi
                    </p>
                  </div>
                </div>
              </div>

              {/* Langkah 3 (Posisi Tengah) */}
              <div className="flex justify-center pt-0.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-white/15 text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-snug">Tambah profil anak</p>
                    <p className="text-[10px] text-white/75 leading-tight mt-0.5">
                      Dilakukan setelah masuk
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daftar Fitur Aplikasi */}
            <div className="mt-7">
              <h2 className="text-lg sm:text-[19px] font-bold leading-snug">
                Apa yang bisa anda lakukan di aplikasi?
              </h2>

              <ul className="mt-4 space-y-3">
                {FEATURES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </span>
                      <span className="text-xs sm:text-[13px] font-semibold text-white">
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Kotak Catatan Perlindungan Data */}
            <div className="mt-7 bg-white/[0.12] rounded-2xl p-4">
              <p className="text-xs font-bold text-white">
                Data Anda terlindungi.
              </p>
              <p className="text-[11px] leading-relaxed text-white/85 mt-1">
                Anda hanya dapat melihat data anak yang terhubung dengan akun Anda. PosyanduKu adalah alat pendamping, bukan alat diagnosis medis.
              </p>
            </div>
          </aside>

          {/* Kolom Kanan: Formulir Buat Akun Keluarga */}
          <section className="lg:col-span-7 bg-white rounded-[24px] p-7 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            <h2 className="text-2xl sm:text-[28px] font-bold text-[#2E5780] tracking-tight">
              Buat akun keluarga
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Data anak dapat ditambahkan setelah Anda masuk.
            </p>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              {/* Sub-bagian: Data orang tua */}
              <h3 className="text-base sm:text-lg font-bold text-[#1E293B]">
                Data orang tua
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 mt-3.5">
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
                    placeholder="Nama sesuai identitas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-400/80 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomorTelepon"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Nomor telepon
                  </label>
                  <input
                    id="nomorTelepon"
                    name="nomorTelepon"
                    type="tel"
                    required
                    value={formData.nomorTelepon}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-400/80 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-400/80 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="posyanduTerdekat"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Posyandu terdekat (opsional)
                  </label>
                  <input
                    id="posyanduTerdekat"
                    name="posyanduTerdekat"
                    type="text"
                    value={formData.posyanduTerdekat}
                    onChange={handleChange}
                    placeholder="Cari nama posyandu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-400/80 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
                  />
                </div>
              </div>

              {/* Sub-bagian: Keamanan akun */}
              <h3 className="text-base sm:text-lg font-bold text-[#1E293B] mt-6">
                Keamanan akun
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 mt-3.5">
                {/* Input Kata Sandi + Tombol Lihat */}
                <div>
                  <label
                    htmlFor="kataSandi"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Kata sandi
                  </label>
                  <div className="relative">
                    <input
                      id="kataSandi"
                      name="kataSandi"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.kataSandi}
                      onChange={handleChange}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-slate-400/80 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Input Konfirmasi Kata Sandi + Tombol Lihat */}
                <div>
                  <label
                    htmlFor="konfirmasiKataSandi"
                    className="block text-xs font-bold text-[#1E293B] mb-1.5"
                  >
                    Konfirmasi kata sandi
                  </label>
                  <div className="relative">
                    <input
                      id="konfirmasiKataSandi"
                      name="konfirmasiKataSandi"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.konfirmasiKataSandi}
                      onChange={handleChange}
                      placeholder="Ulangi kata sandi"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-slate-400/80 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Lihat konfirmasi kata sandi'}
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mt-2">
                Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
              </p>

              {/* Checkbox Persetujuan Privasi (Wajib Dicentang) */}
              <label className="flex items-start gap-2.5 mt-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="setujuPrivasi"
                  required
                  checked={formData.setujuPrivasi}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded border-slate-400 text-[#2E5780] focus:ring-[#2E5780] cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-snug">
                  Saya setuju data saya dan anak saya digunakan untuk pemantauan kesehatan sesuai kebijakan privasi.
                </span>
              </label>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-6">
                <Link
                  to="/login"
                  className="w-full sm:w-auto text-center px-7 py-3 rounded-xl border border-[#2E5780] text-[#1E293B] text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Kembali
                </Link>

                <button
                  type="submit"
                  disabled={!formData.setujuPrivasi}
                  title={
                    !formData.setujuPrivasi
                      ? 'Centang persetujuan kebijakan privasi terlebih dahulu'
                      : 'Buat akun keluarga'
                  }
                  className="w-full flex-1 bg-[#2E5780] hover:bg-[#234466] disabled:opacity-50 disabled:hover:bg-[#2E5780] disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Buat akun keluarga
                </button>
              </div>
            </form>
          </section>

        </div>
      </main>
    </div>
  );
}