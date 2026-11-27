import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart3, BookOpen, Calendar, Eye, EyeOff, Heart, } from 'lucide-react';
const FEATURES = [
    { icon: BarChart3, text: 'Pantau Riwayat Tumbuh Kembang' },
    { icon: Calendar, text: 'Pantau Riwayat Tumbuh Kembang' },
    { icon: BookOpen, text: 'Pantau Riwayat Tumbuh Kembang' },
    { icon: Heart, text: 'Pantau Riwayat Tumbuh Kembang' },
];
export default function Register() {
    const { data, setData, post, processing, errors, reset, } = useForm({
        name: '',
        phone: '',
        email: '',
        posyandu_terdekat: '',
        password: '',
        password_confirmation: '',
        privacy_accepted: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const submit = (event) => {
        event.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };
    return (<PublicLayout>
            <Head title="Daftar"/>

            <main className="mx-auto mt-8 w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                    <aside className="rounded-[24px] bg-[#2E5780] p-7 text-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-8 lg:col-span-5">
                        <p className="text-xs font-medium text-white/85">
                            Registrasi orang tua
                        </p>
                        <h1 className="mt-1.5 text-2xl font-bold leading-[1.28] tracking-tight sm:text-[26px]">
                            Mulai catatan tumbuh kembang anak Anda
                        </h1>

                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-2.5">
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
                                        1
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold leading-snug">
                                            Data orang tua
                                        </p>
                                        <p className="mt-0.5 text-[10px] leading-tight text-white/75">
                                            Nama, telepon, dan email
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
                                        2
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold leading-snug">
                                            Keamanan akun
                                        </p>
                                        <p className="mt-0.5 text-[10px] leading-tight text-white/75">
                                            Buat kata sandi
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-0.5">
                                <div className="flex items-start gap-2.5">
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
                                        3
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold leading-snug">
                                            Tambah profil anak
                                        </p>
                                        <p className="mt-0.5 text-[10px] leading-tight text-white/75">
                                            Dilakukan setelah masuk
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7">
                            <h2 className="text-lg font-bold leading-snug sm:text-[19px]">
                                Apa yang bisa anda lakukan di aplikasi?
                            </h2>
                            <ul className="mt-4 space-y-3">
                                {FEATURES.map(({ icon: Icon, text }, index) => (<li key={index} className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                                            <Icon className="h-4 w-4 text-white"/>
                                        </span>
                                        <span className="text-xs font-semibold text-white sm:text-[13px]">
                                            {text}
                                        </span>
                                    </li>))}
                            </ul>
                        </div>

                        <div className="mt-7 rounded-2xl bg-white/[0.12] p-4">
                            <p className="text-xs font-bold text-white">
                                Data Anda terlindungi.
                            </p>
                            <p className="mt-1 text-[11px] leading-relaxed text-white/85">
                                Anda hanya dapat melihat data anak yang
                                terhubung dengan akun Anda. PosyanduKu adalah
                                alat pendamping, bukan alat diagnosis medis.
                            </p>
                        </div>
                    </aside>

                    <section className="rounded-[24px] bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-10 lg:col-span-7">
                        <h2 className="text-2xl font-bold tracking-tight text-[#2E5780] sm:text-[28px]">
                            Buat akun keluarga
                        </h2>
                        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                            Data anak dapat ditambahkan setelah Anda masuk.
                        </p>

                        <form onSubmit={submit} className="mt-6">
                            <h3 className="text-base font-bold text-[#1E293B] sm:text-lg">
                                Data orang tua
                            </h3>
                            <div className="mt-3.5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-[#1E293B]">
                                        Nama lengkap
                                    </label>
                                    <input id="name" name="name" type="text" autoComplete="name" required value={data.name} onChange={(event) => setData('name', event.target.value)} placeholder="Nama sesuai identitas" className="w-full rounded-xl border border-slate-400/80 bg-white px-3.5 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-400 transition-colors focus:border-[#2E5780] focus:outline-none"/>
                                    {errors.name && (<p className="mt-1.5 text-xs text-red-600">
                                            {errors.name}
                                        </p>)}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-[#1E293B]">
                                        Nomor telepon
                                    </label>
                                    <input id="phone" name="phone" type="tel" autoComplete="tel" required value={data.phone} onChange={(event) => setData('phone', event.target.value)} placeholder="08xxxxxxxxxx" className="w-full rounded-xl border border-slate-400/80 bg-white px-3.5 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-400 transition-colors focus:border-[#2E5780] focus:outline-none"/>
                                    {errors.phone && (<p className="mt-1.5 text-xs text-red-600">
                                            {errors.phone}
                                        </p>)}
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-[#1E293B]">
                                        Email
                                    </label>
                                    <input id="email" name="email" type="email" autoComplete="username" required value={data.email} onChange={(event) => setData('email', event.target.value)} placeholder="nama@email.com" className="w-full rounded-xl border border-slate-400/80 bg-white px-3.5 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-400 transition-colors focus:border-[#2E5780] focus:outline-none"/>
                                    {errors.email && (<p className="mt-1.5 text-xs text-red-600">
                                            {errors.email}
                                        </p>)}
                                </div>

                                <div>
                                    <label htmlFor="posyandu_terdekat" className="mb-1.5 block text-xs font-bold text-[#1E293B]">
                                        Posyandu terdekat (opsional)
                                    </label>
                                    <input id="posyandu_terdekat" name="posyandu_terdekat" type="text" value={data.posyandu_terdekat} onChange={(event) => setData('posyandu_terdekat', event.target.value)} placeholder="Cari nama posyandu" className="w-full rounded-xl border border-slate-400/80 bg-white px-3.5 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-400 transition-colors focus:border-[#2E5780] focus:outline-none"/>
                                    {errors.posyandu_terdekat && (<p className="mt-1.5 text-xs text-red-600">
                                            {errors.posyandu_terdekat}
                                        </p>)}
                                </div>
                            </div>

                            <h3 className="mt-6 text-base font-bold text-[#1E293B] sm:text-lg">
                                Keamanan akun
                            </h3>
                            <div className="mt-3.5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-[#1E293B]">
                                        Kata sandi
                                    </label>
                                    <div className="relative">
                                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={data.password} onChange={(event) => setData('password', event.target.value)} placeholder="Minimal 8 karakter" className="w-full rounded-xl border border-slate-400/80 bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1E293B] placeholder:text-slate-400 transition-colors focus:border-[#2E5780] focus:outline-none"/>
                                        <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600" aria-label={showPassword
            ? 'Sembunyikan kata sandi'
            : 'Lihat kata sandi'}>
                                            {showPassword ? (<Eye className="h-4 w-4"/>) : (<EyeOff className="h-4 w-4"/>)}
                                        </button>
                                    </div>
                                    {errors.password && (<p className="mt-1.5 text-xs text-red-600">
                                            {errors.password}
                                        </p>)}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="mb-1.5 block text-xs font-bold text-[#1E293B]">
                                        Konfirmasi kata sandi
                                    </label>
                                    <div className="relative">
                                        <input id="password_confirmation" name="password_confirmation" type={showConfirmPassword
            ? 'text'
            : 'password'} autoComplete="new-password" required value={data.password_confirmation} onChange={(event) => setData('password_confirmation', event.target.value)} placeholder="Ulangi kata sandi" className="w-full rounded-xl border border-slate-400/80 bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1E293B] placeholder:text-slate-400 transition-colors focus:border-[#2E5780] focus:outline-none"/>
                                        <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600" aria-label={showConfirmPassword
            ? 'Sembunyikan konfirmasi kata sandi'
            : 'Lihat konfirmasi kata sandi'}>
                                            {showConfirmPassword ? (<Eye className="h-4 w-4"/>) : (<EyeOff className="h-4 w-4"/>)}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (<p className="mt-1.5 text-xs text-red-600">
                                            {errors.password_confirmation}
                                        </p>)}
                                </div>
                            </div>

                            <p className="mt-2 text-[11px] text-slate-600">
                                Gunakan minimal 8 karakter dengan kombinasi huruf
                                dan angka.
                            </p>

                            <label className="mt-3.5 flex cursor-pointer select-none items-start gap-2.5">
                                <input type="checkbox" name="privacy_accepted" required checked={data.privacy_accepted} onChange={(event) => setData('privacy_accepted', event.target.checked)} className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-400 text-[#2E5780] focus:ring-[#2E5780]"/>
                                <span className="text-xs leading-snug text-slate-700">
                                    Saya setuju data saya dan anak saya
                                    digunakan untuk pemantauan kesehatan sesuai
                                    kebijakan privasi.
                                </span>
                            </label>

                            <div className="mt-6 flex flex-col items-center gap-3.5 sm:flex-row">
                                <Link href={route('login')} className="w-full rounded-xl border border-[#2E5780] px-7 py-3 text-center text-xs font-bold text-[#1E293B] transition-colors hover:bg-slate-50 sm:w-auto">
                                    Kembali
                                </Link>
                                <button type="submit" disabled={processing || !data.privacy_accepted} title={!data.privacy_accepted
            ? 'Centang persetujuan kebijakan privasi terlebih dahulu'
            : 'Buat akun keluarga'} className="w-full flex-1 cursor-pointer rounded-xl bg-[#2E5780] px-6 py-3 text-xs font-semibold text-white transition-all hover:bg-[#234466] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm">
                                    {processing
            ? 'Memproses...'
            : 'Buat akun keluarga'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </PublicLayout>);
}
