import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

const RECOVERY_STEPS = [
  {
    number: 1,
    title: 'Masukkan email terdaftar',
    desc: 'Kami kirim tautan pemulihan ke email itu',
  },
  {
    number: 2,
    title: 'Buka tautan di email',
    desc: 'Periksa folder spam bila belum masuk',
  },
  {
    number: 3,
    title: 'Buat kata sandi baru',
    desc: 'Lalu masuk kembali ke akun Anda',
  },
];

const NEXT_STEPS = [
  'Buka email yang Anda daftarkan',
  'Klik tautan pemulihan di dalam email',
  'Buat kata sandi baru, lalu masuk kembali',
];

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    console.log('Mengirim tautan pemulihan ke:', email);
    setIsSubmitted(true);
  };

  const handleResend = () => {
    if (resendCooldown) return;
    console.log('Mengirim ulang tautan pemulihan ke:', email);
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 30000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex items-center">
        {!isSubmitted ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <section className="lg:col-span-6">
              <p className="text-xs font-semibold text-[#2E5780]">
                Akses akun
              </p>
              <h1 className="text-3xl sm:text-[34px] font-bold text-[#2E5780] tracking-tight mt-1">
                Lupa kata sandi?
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 mt-1.5">
                Kami akan membantu mengirim tautan pemulihan ke email akun Anda
              </p>

              <div className="bg-white rounded-[24px] p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mt-6">
                <h2 className="text-lg sm:text-[19px] font-bold text-[#1E293B]">
                  Pulihkan akun
                </h2>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div>
                    <label
                      htmlFor="recoveryEmail"
                      className="block text-xs font-bold text-[#1E293B] mb-1.5"
                    >
                      Email terdaftar
                    </label>
                    <input
                      id="recoveryEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-400/80 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#2E5780] transition-colors"
                    />
                    <p className="text-[11px] text-slate-600 mt-1.5">
                      Gunakan email yang Anda pakai saat mendaftar.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-sm font-semibold py-3.5 rounded-xl transition-colors cursor-pointer mt-5"
                  >
                    Kirim tautan pemulihan
                  </button>

                  <Link
                    to="/login"
                    className="block w-full text-center border border-[#2E5780] text-[#1E293B] hover:bg-slate-50 text-xs sm:text-sm font-semibold py-3 rounded-xl transition-colors mt-3"
                  >
                    Kembali masuk
                  </Link>
                </form>
              </div>
            </section>

            <aside className="relative lg:col-span-6 bg-[#2E5780] rounded-[24px] p-8 sm:p-10 text-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div
                aria-hidden="true"
                className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/[0.08] pointer-events-none"
              />

              <h2 className="relative z-10 text-2xl sm:text-[26px] font-bold tracking-tight">
                Cara pemulihan
              </h2>

              <ol className="relative z-10 mt-6 space-y-5">
                {RECOVERY_STEPS.map((step) => (
                  <li key={step.number} className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-white/15 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.number}
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-snug">
                        {step.title}
                      </p>
                      <p className="text-xs text-white/80 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="relative z-10 mt-8 bg-white/[0.12] rounded-2xl px-5 py-4">
                <p className="text-xs font-semibold text-white">
                  Akun kader? Hubungi admin posyandu untuk bantuan akses.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <section className="lg:col-span-7">
              <span className="inline-block bg-[#CBE5FA] text-[#1E4E79] text-xs font-semibold px-4 py-1.5 rounded-full">
                Pemulihan akun
              </span>

              <h1 className="text-3xl sm:text-[34px] font-bold text-[#2E5780] tracking-tight mt-4 leading-tight">
                Periksa kotak masuk email Anda
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed">
                Jika email terdaftar, tautan pemulihan akan dikirim. Periksa juga folder spam
              </p>

              <div className="inline-flex items-center gap-2.5 border border-[#BAE0FD] bg-white/60 rounded-full px-4 py-2 mt-5">
                <span className="w-6 h-6 rounded-full bg-[#CBE5FA] text-[#2E5780] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-medium text-slate-700">
                  Dikirim ke {email || 'nama@email.com'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-7">
                <Link
                  to="/login"
                  className="bg-[#2E5780] hover:bg-[#234466] text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors"
                >
                  Kembali ke halaman masuk
                </Link>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown}
                  className="border border-[#2E5780] hover:bg-white/60 disabled:opacity-60 text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#1E293B]">
                    Belum menerima email?
                  </span>{' '}
                  <span className="font-bold text-[#2E5780] hover:underline">
                    {resendCooldown ? 'Terkirim ulang' : 'Kirim ulang'}
                  </span>
                </button>
              </div>
            </section>

            <aside className="lg:col-span-5 bg-[#2E5780] rounded-[24px] p-8 sm:p-9 text-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3.5">
                <Mail className="w-9 h-9 text-white stroke-[1.75] shrink-0" />
                <h2 className="text-xl sm:text-[22px] font-bold tracking-tight">
                  Langkah selanjutnya
                </h2>
              </div>

              <ol className="mt-6 space-y-4">
                {NEXT_STEPS.map((stepText, index) => (
                  <li key={index} className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-white/15 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-[13px] font-medium text-white/95">
                      {stepText}
                    </span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}