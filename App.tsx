import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage }  from './src/pages/LoginPage';
import { Toaster } from './src/components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Fallback - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </BrowserRouter>
  );
}