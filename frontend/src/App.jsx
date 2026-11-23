import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardOrtu from './pages/orang-tua/DashboardOrtu';
import PantauPertumbuhan from './pages/orang-tua/PantauPertumbuhan';

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
      </Routes>
    </BrowserRouter>
  );
}