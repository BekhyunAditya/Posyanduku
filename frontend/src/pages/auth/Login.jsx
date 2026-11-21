import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, ClipboardCheck, Shield, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import ibuAnakImg from '../../assets/images/ibu-anak-login.png';

const ROLES = [
  {
    id: 'orang_tua',
    label: 'Orang Tua',
    description: 'Pantau tumbuh kembang dan imunisasi anak.',
    icon: Users,
    redirectPath: '/ortu/dashboard',
  },
  {
    id: 'kader',
    label: 'Kader',
    description: 'Catat pengukuran dan kelola kegiatan posyandu.',
    icon: ClipboardCheck,
    redirectPath: '/kader/dashboard',
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Kelola akun, data posyandu, dan artikel.',
    icon: Shield,
    redirectPath: '/admin/dashboard',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('orang_tua');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const activeRoleObj = ROLES.find((role) => role.id === selectedRole);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ role: selectedRole, email, password, rememberMe });
    alert(`Berhasil masuk sebagai ${activeRoleObj.label}!`);
    navigate(activeRoleObj.redirectPath);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          
          <section className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#1D3B58] tracking-tight">
              Masuk ke Posyanduku
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Pilih siapa Anda, supaya dashboard yang tampil sesuai kebutuhan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#F39C4F] bg-[#FFF9F2] ring-1 ring-[#F39C4F]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                        isSelected
                          ? 'bg-[#F39C4F] text-white'
                          : 'bg-[#EEF2F6] text-[#2E5780]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#1D3B58]">
                        {role.label}
                      </h2>
                      <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                        {role.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-[#1D3B58] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#1D3B58] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-[#1D3B58] mb-1.5"
                >
                  Kata sandi
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#1D3B58] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Tampilkan kata sandi"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#2E5780] focus:ring-[#2E5780]"
                  />
                  <span className="text-xs text-slate-500">Ingat saya</span>
                </label>

                <Link
                  to="/lupa-kata-sandi"
                  className="text-xs font-bold text-[#1D3B58] hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E5780] hover:bg-[#234466] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors cursor-pointer mt-2"
              >
                Masuk sebagai {activeRoleObj?.label}
              </button>
            </form>

            <div className="text-center mt-6 space-y-1.5">
              <p className="text-xs text-slate-500">
                Belum punya akun?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#1D3B58] hover:underline"
                >
                  Daftar sebagai orang tua
                </Link>
              </p>
              <p className="text-[11px] text-slate-400">
                Akun kader dibuat dan diverifikasi oleh admin posyandu.
              </p>
            </div>
          </section>

          <aside className="relative lg:col-span-5 bg-[#2E5780] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden text-white">
            <div
              aria-hidden="true"
              className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/[0.08] pointer-events-none"
            />

            <div className="relative z-10">
              <h2 className="text-[28px] sm:text-[31px] font-bold leading-[1.24] tracking-tight">
                Lebih mudah
                <br />
                memantau, lebih tenang
                <br />
                mendampingi.
              </h2>
              <p className="text-[13px] text-white/85 mt-3.5 leading-relaxed">
                Satu ruang untuk orang tua, kader, dan pengelola posyandu.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex justify-center">
              <div className="relative w-full max-w-[310px] flex justify-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-4 top-7 bottom-0 rounded-[22px] bg-gradient-to-b from-[#3B638B] via-[#6B8AA8] to-[#B8C7D6]"
                />

                <img
                  src={ibuAnakImg}
                  alt="Ibu dan balita PosyanduKu"
                  className="relative z-10 w-full object-contain rounded-b-[22px] select-none"
                />
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}