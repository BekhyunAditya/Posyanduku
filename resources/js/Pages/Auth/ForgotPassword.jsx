import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
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
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(Boolean(status));
    const [resendCooldown, setResendCooldown] = useState(false);
    useEffect(() => {
        if (status) {
            setIsSubmitted(true);
        }
    }, [status]);
    const submit = (event) => {
        event.preventDefault();
        post(route('password.email'), {
            onSuccess: () => setIsSubmitted(true),
        });
    };
    const handleResend = () => {
        if (resendCooldown || processing) {
            return;
        }
        post(route('password.email'), {
            onSuccess: () => {
                setResendCooldown(true);
                window.setTimeout(() => setResendCooldown(false), 30000);
            },
        });
    };
    return (<PublicLayout>
            <Head title="Lupa kata sandi"/>

            <main className="mx-auto mt-10 flex w-full max-w-6xl flex-1 items-center px-4 sm:px-6 lg:px-8">
                {!isSubmitted ? (<div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                        <section className="lg:col-span-6">
                            <p className="text-xs font-semibold text-[#2E5780]">
                                Akses akun
                            </p>
                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#2E5780] sm:text-[34px]">
                                Lupa kata sandi?
                            </h1>
                            <p className="mt-1.5 text-xs text-slate-700 sm:text-sm">
                                Kami akan membantu mengirim tautan pemulihan ke
                                email akun Anda
                            </p>

                            <div className="mt-6 rounded-[24px] bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-9">
                                <h2 className="text-lg font-bold text-[#1E293B] sm:text-[19px]">
                                    Pulihkan akun
                                </h2>

                                <form onSubmit={submit} className="mt-4">
                                    <div>
                                        <label htmlFor="recoveryEmail" className="mb-1.5 block text-xs font-bold text-[#1E293B]">
                                            Email terdaftar
                                        </label>
                                        <input id="recoveryEmail" type="email" autoComplete="email" required value={data.email} onChange={(event) => setData('email', event.target.value)} placeholder="nama@email.com" className="w-full rounded-xl border border-slate-400/80 bg-white px-4 py-3 text-sm text-[#1E293B] placeholder:text-slate-400 transition-colors focus:border-[#2E5780] focus:outline-none"/>
                                        {errors.email && (<p className="mt-1.5 text-xs text-red-600">
                                                {errors.email}
                                            </p>)}
                                        <p className="mt-1.5 text-[11px] text-slate-600">
                                            Gunakan email yang Anda pakai saat
                                            mendaftar.
                                        </p>
                                    </div>

                                    <button type="submit" disabled={processing} className="mt-5 w-full cursor-pointer rounded-xl bg-[#2E5780] py-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#234466] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm">
                                        {processing
                ? 'Mengirim...'
                : 'Kirim tautan pemulihan'}
                                    </button>

                                    <Link href={route('login')} className="mt-3 block w-full rounded-xl border border-[#2E5780] py-3 text-center text-xs font-semibold text-[#1E293B] transition-colors hover:bg-slate-50 sm:text-sm">
                                        Kembali masuk
                                    </Link>
                                </form>
                            </div>
                        </section>

                        <aside className="relative overflow-hidden rounded-[24px] bg-[#2E5780] p-8 text-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10 lg:col-span-6">
                            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/[0.08]"/>

                            <h2 className="relative z-10 text-2xl font-bold tracking-tight sm:text-[26px]">
                                Cara pemulihan
                            </h2>

                            <ol className="relative z-10 mt-6 space-y-5">
                                {RECOVERY_STEPS.map((step) => (<li key={step.number} className="flex items-start gap-3.5">
                                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
                                            {step.number}
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold leading-snug">
                                                {step.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-white/80">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </li>))}
                            </ol>

                            <div className="relative z-10 mt-8 rounded-2xl bg-white/[0.12] px-5 py-4">
                                <p className="text-xs font-semibold text-white">
                                    Akun kader? Hubungi admin posyandu untuk
                                    bantuan akses.
                                </p>
                            </div>
                        </aside>
                    </div>) : (<div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                        <section className="lg:col-span-7">
                            <span className="inline-block rounded-full bg-[#CBE5FA] px-4 py-1.5 text-xs font-semibold text-[#1E4E79]">
                                Pemulihan akun
                            </span>

                            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#2E5780] sm:text-[34px]">
                                Periksa kotak masuk email Anda
                            </h1>
                            <p className="mt-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                                Jika email terdaftar, tautan pemulihan akan
                                dikirim. Periksa juga folder spam
                            </p>

                            <div role="status" className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[#BAE0FD] bg-white/60 px-4 py-2">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CBE5FA] text-[#2E5780]">
                                    <Mail className="h-3.5 w-3.5"/>
                                </span>
                                <span className="text-xs font-medium text-slate-700">
                                    Dikirim ke {data.email || 'nama@email.com'}
                                </span>
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-4">
                                <Link href={route('login')} className="rounded-xl bg-[#2E5780] px-7 py-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#234466] sm:text-sm">
                                    Kembali ke halaman masuk
                                </Link>

                                <button type="button" onClick={handleResend} disabled={resendCooldown || processing} className="cursor-pointer rounded-xl border border-[#2E5780] px-6 py-3.5 text-xs transition-colors hover:bg-white/60 disabled:opacity-60 sm:text-sm">
                                    <span className="font-semibold text-[#1E293B]">
                                        Belum menerima email?
                                    </span>{' '}
                                    <span className="font-bold text-[#2E5780] hover:underline">
                                        {resendCooldown
                ? 'Terkirim ulang'
                : 'Kirim ulang'}
                                    </span>
                                </button>
                            </div>
                        </section>

                        <aside className="rounded-[24px] bg-[#2E5780] p-8 text-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-9 lg:col-span-5">
                            <div className="flex items-center gap-3.5">
                                <Mail className="h-9 w-9 shrink-0 text-white [stroke-width:1.75]"/>
                                <h2 className="text-xl font-bold tracking-tight sm:text-[22px]">
                                    Langkah selanjutnya
                                </h2>
                            </div>

                            <ol className="mt-6 space-y-4">
                                {NEXT_STEPS.map((stepText, index) => (<li key={stepText} className="flex items-center gap-3.5">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
                                            {index + 1}
                                        </span>
                                        <span className="text-xs font-medium text-white/95 sm:text-[13px]">
                                            {stepText}
                                        </span>
                                    </li>))}
                            </ol>
                        </aside>
                    </div>)}
            </main>
        </PublicLayout>);
}
