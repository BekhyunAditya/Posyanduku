import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ArrowRight, X, CheckCircle2, Trash2 } from 'lucide-react';
import SidebarAdmin from '../../Components/layout/SidebarAdmin';

const STORAGE_KEY = 'posyanduku_admin_accounts';

const INITIAL_ACCOUNTS = [
    {
        id: 'acc-1',
        nama: 'Siti Rahmawati',
        email: 'siti@example.com',
        peran: 'Kader',
        posyandu: 'Melati 01',
        status: 'Aktif',
    },
    {
        id: 'acc-2',
        nama: 'Dewi Anggraini',
        email: 'dewi@example.com',
        peran: 'Kader',
        posyandu: 'Mawar 02',
        status: 'Aktif',
    },
    {
        id: 'acc-3',
        nama: 'Ratna Sari',
        email: 'ratna@example.com',
        peran: 'Kader',
        posyandu: 'Anggrek 03',
        status: 'Undangan terkirim',
    },
    {
        id: 'acc-4',
        nama: 'Admin wilayah',
        email: 'admin@example.com',
        peran: 'Admin',
        posyandu: 'Semua wilayah',
        status: 'Aktif',
    },
];

const MONTH_OPTIONS = ['November 2026', 'Oktober 2026', 'September 2026'];

const KelolaPengguna = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2026');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [editPeran, setEditPeran] = useState('Kader');
    const [editPosyandu, setEditPosyandu] = useState('');
    const [editStatus, setEditStatus] = useState('Aktif');
    const dropdownRef = useRef(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setAccounts(parsed);
                }
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
            }
        } catch {
            setAccounts(INITIAL_ACCOUNTS);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const syncAccounts = (updatedList) => {
        setAccounts(updatedList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    };

    const openManageModal = (account) => {
        setSelectedAccount(account);
        setEditPeran(account.peran);
        setEditPosyandu(account.posyandu);
        setEditStatus(account.status);
    };

    const handleSaveManage = (e) => {
        e.preventDefault();
        if (!selectedAccount) return;

        const updated = accounts.map((acc) =>
            acc.id === selectedAccount.id
                ? {
                      ...acc,
                      peran: editPeran,
                      posyandu: editPeran === 'Admin' ? 'Semua wilayah' : editPosyandu,
                      status: editStatus,
                  }
                : acc
        );
        syncAccounts(updated);
        setSelectedAccount(null);
    };

    const handleDeleteAccount = (id) => {
        const updated = accounts.filter((acc) => acc.id !== id);
        syncAccounts(updated);
        setSelectedAccount(null);
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col lg:flex-row">
            <Head title="Akun & Peran - Posyanduku" />

            <SidebarAdmin activeMenu="akun" />

            <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1280px]">
                {/* Breadcrumb */}
                <p className="text-xs font-medium text-[#475569] mb-3">
                    Admin/Akun &amp; peran
                </p>

                {/* Dropdown Filter Bulan */}
                <div className="relative inline-block mb-6" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="inline-flex items-center gap-2.5 bg-[#B5D5F0] hover:bg-[#A6CBEB] text-[#1D3B58] font-semibold text-sm sm:text-[15px] px-5 py-2.5 rounded-full transition-colors cursor-pointer shadow-2xs"
                    >
                        <span>{selectedMonth}</span>
                        <ChevronDown
                            className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
                                dropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-slate-100 py-1.5 z-20">
                            {MONTH_OPTIONS.map((month) => (
                                <button
                                    key={month}
                                    type="button"
                                    onClick={() => {
                                        setSelectedMonth(month);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                                        selectedMonth === month
                                            ? 'bg-[#E3EEF8] text-[#1D3B58] font-semibold'
                                            : 'text-[#334155] hover:bg-slate-50'
                                    }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Header Judul */}
                <header className="mb-5">
                    <h1 className="text-3xl sm:text-[36px] font-bold text-[#1E293B] tracking-tight leading-tight">
                        Akun yang tepat untuk setiap peran.
                    </h1>
                    <p className="text-sm sm:text-[15px] text-[#475569] mt-1.5">
                        Kelola akses kader dan administrator sesuai wilayah tugas.
                    </p>
                </header>

                {/* Tombol Aksi */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/akun/tambah')}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                        + Tambah akun kader
                    </button>

                    <button
                        type="button"
                        onClick={() => router.visit('/admin/akun/aturan-peran')}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#1D3B58] text-[13px] font-semibold transition-colors cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/70"
                    >
                        Aturan peran
                    </button>
                </div>

                {/* Kartu Tabel Daftar Akun Petugas */}
                <section className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
                    <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">
                        Daftar akun petugas
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#FDEBD3] text-[#1E293B] text-xs font-semibold">
                                    <th className="py-3 px-4 rounded-l-[10px]">
                                        Nama / email
                                    </th>
                                    <th className="py-3 px-4">Peran</th>
                                    <th className="py-3 px-4">Posyandu</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 rounded-r-[10px]">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] text-[#334155]">
                                {accounts.map((acc) => (
                                    <tr
                                        key={acc.id}
                                        className="border-b border-[#7B9EC0]/60 hover:bg-[#F8FAFC] transition-colors"
                                    >
                                        <td className="py-3.5 px-4">
                                            <p className="font-medium text-[#1E293B] leading-snug">
                                                {acc.nama}
                                            </p>
                                            <p className="text-xs text-[#64748B] mt-0.5">
                                                {acc.email}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {acc.peran}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#1E293B]">
                                            {acc.posyandu}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`font-medium ${
                                                    acc.status === 'Aktif'
                                                        ? 'text-[#1E293B]'
                                                        : 'text-[#475569]'
                                                }`}
                                            >
                                                {acc.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                type="button"
                                                onClick={() => openManageModal(acc)}
                                                className="inline-flex items-center gap-1 text-[#1E293B] hover:text-[#2E5780] font-medium transition-colors cursor-pointer"
                                            >
                                                <span>Kelola</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Banner Informasi Bawah */}
                <section className="bg-[#B5D5F0] rounded-[18px] px-6 py-5 text-[#1E293B]">
                    <h3 className="text-[15px] font-bold text-[#1E293B]">
                        Akses sesuai kebutuhan
                    </h3>
                    <p className="text-[13px] text-[#1E293B]/90 mt-1.5 leading-relaxed">
                        Perubahan peran dicatat dalam log aktivitas. Data kesehatan
                        individual mengikuti hubungan keluarga dan kewenangan petugas.
                    </p>
                </section>
            </main>

            {/* Modal Kelola Akun Petugas */}
            {selectedAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs px-4">
                    <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-xl border border-slate-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#1E293B]">
                                    Kelola Akun Petugas
                                </h3>
                                <p className="text-xs text-[#64748B] mt-0.5">
                                    {selectedAccount.nama} ({selectedAccount.email})
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAccount(null)}
                                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveManage} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                                    Peran
                                </label>
                                <select
                                    value={editPeran}
                                    onChange={(e) => setEditPeran(e.target.value)}
                                    className="w-full rounded-[14px] border border-[#2E5780]/50 px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:border-[#2E5780]"
                                >
                                    <option value="Kader">Kader</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                                    Posyandu Tugas
                                </label>
                                <input
                                    type="text"
                                    value={
                                        editPeran === 'Admin'
                                            ? 'Semua wilayah'
                                            : editPosyandu
                                    }
                                    disabled={editPeran === 'Admin'}
                                    onChange={(e) => setEditPosyandu(e.target.value)}
                                    className="w-full rounded-[14px] border border-[#2E5780]/50 px-4 py-2.5 text-sm text-[#1E293B] disabled:bg-slate-100 focus:outline-none focus:border-[#2E5780]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                                    Status Akun
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full rounded-[14px] border border-[#2E5780]/50 px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:border-[#2E5780]"
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Undangan terkirim">
                                        Undangan terkirim
                                    </option>
                                    <option value="Nonaktif">Nonaktif</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteAccount(selectedAccount.id)
                                    }
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus akun
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedAccount(null)}
                                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#475569] hover:bg-slate-100 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2E5780] hover:bg-[#234466] text-white text-xs font-semibold cursor-pointer"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Simpan perubahan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaPengguna;