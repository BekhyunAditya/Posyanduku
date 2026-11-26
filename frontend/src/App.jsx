import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Halaman Publik & Autentikasi
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Halaman Orang Tua & Edukasi
import DashboardOrtu from './pages/orang-tua/DashboardOrtu';
import PantauPertumbuhan from './pages/orang-tua/PantauPertumbuhan';
import BukuKiaDigital from './pages/orang-tua/BukuKiaDigital';
import PanduanKunjungan from './pages/orang-tua/PanduanKunjungan';
import CatatanKonsultasi from './pages/orang-tua/CatatanKonsultasi';
import CatatanTersimpan from './pages/orang-tua/CatatanTersimpan';
import KalenderPosyandu from './pages/orang-tua/KalenderPosyandu';
import NotifikasiPengingat from './pages/orang-tua/NotifikasiPengingat';
import ProfilAnak from './pages/orang-tua/ProfilAnak';
import TambahProfilAnak from './pages/orang-tua/TambahProfilAnak';
import KonfirmasiPenyimpanan from './pages/orang-tua/KonfirmasiPenyimpanan';
import JadwalImunisasi from './pages/orang-tua/JadwalImunisasi';
import EdukasiArtikel from './pages/orang-tua/EdukasiArtikel';
import DetailEdukasi from './pages/orang-tua/DetailEdukasi';

function App() {
  return (
    <Router>
      <Routes>
        {/* Beranda Publik */}
        <Route path="/" element={<LandingPage />} />

        {/* Autentikasi */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lupa-kata-sandi" element={<ForgotPassword />} />

        {/* Orang Tua & Edukasi */}
        <Route path="/ortu/dashboard" element={<DashboardOrtu />} />
        <Route path="/ortu/pertumbuhan" element={<PantauPertumbuhan />} />
        <Route path="/ortu/buku-kia" element={<BukuKiaDigital />} />
        <Route path="/ortu/panduan-kunjungan" element={<PanduanKunjungan />} />
        <Route path="/ortu/panduan-kunjungan/catatan" element={<CatatanKonsultasi />} />
        <Route path="/ortu/panduan-tindakan" element={<CatatanKonsultasi />} />
        <Route path="/ortu/panduan-kunjungan/catatan-tersimpan" element={<CatatanTersimpan />} />
        <Route path="/ortu/jadwal-posyandu" element={<KalenderPosyandu />} />
        <Route path="/ortu/pengingat" element={<NotifikasiPengingat />} />
        <Route path="/ortu/profil-anak" element={<ProfilAnak />} />
        <Route path="/ortu/tambah-anak" element={<TambahProfilAnak />} />
        <Route path="/ortu/profil-anak/konfirmasi" element={<KonfirmasiPenyimpanan />} />
        <Route path="/ortu/imunisasi" element={<JadwalImunisasi />} />
        <Route path="/edukasi" element={<EdukasiArtikel />} />
        <Route path="/edukasi/:slug" element={<DetailEdukasi />} />
      </Routes>
    </Router>
  );
}

export default App;