import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardOrtu from './pages/orang-tua/DashboardOrtu';
import PantauPertumbuhan from './pages/orang-tua/PantauPertumbuhan';
import BukuKiaDigital from './pages/orang-tua/BukuKiaDigital';
import PanduanKunjungan from './pages/orang-tua/PanduanKunjungan';
import KalenderPosyandu from './pages/orang-tua/KalenderPosyandu';
import NotifikasiPengingat from './pages/orang-tua/NotifikasiPengingat';
import ProfilAnak from './pages/orang-tua/ProfilAnak';
import TambahProfilAnak from './pages/orang-tua/TambahProfilAnak';
import KonfirmasiPenyimpanan from './pages/orang-tua/KonfirmasiPenyimpanan';
import JadwalImunisasi from './pages/orang-tua/JadwalImunisasi';
import CatatanKonsultasi from './pages/orang-tua/CatatanKonsultasi';
import CatatanTersimpan from './pages/orang-tua/CatatanTersimpan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lupa-kata-sandi" element={<ForgotPassword />} />
        <Route path="/ortu/dashboard" element={<DashboardOrtu />} />
        <Route path="/ortu/pertumbuhan" element={<PantauPertumbuhan />} />
        <Route path="/ortu/buku-kia" element={<BukuKiaDigital />} />
        <Route path="/ortu/panduan-kunjungan" element={<PanduanKunjungan />} />
        <Route path="/ortu/panduan-kunjungan/catatan" element={<CatatanKonsultasi />} />
        <Route path="/ortu/panduan-kunjungan/catatan-tersimpan" element={<CatatanTersimpan />} />
        <Route path="/ortu/panduan-tindakan" element={<CatatanKonsultasi />} />
        <Route path="/ortu/jadwal-posyandu" element={<KalenderPosyandu />} />
        <Route path="/ortu/pengingat" element={<NotifikasiPengingat />} />
        <Route path="/ortu/profil-anak" element={<ProfilAnak />} />
        <Route path="/ortu/tambah-anak" element={<TambahProfilAnak />} />
        <Route path="/ortu/profil-anak/konfirmasi" element={<KonfirmasiPenyimpanan />} />
        <Route path="/ortu/imunisasi" element={<JadwalImunisasi />} />
      </Routes>
    </BrowserRouter>
  );
}