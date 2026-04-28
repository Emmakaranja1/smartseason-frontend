import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage }  from './src/pages/LoginPage';
import { AdminDashboard } from './src/pages/AdminDashboard';
import { AgentDashboard } from './src/pages/AgentDashboard';
import { FieldDetail } from './src/pages/FieldDetail';
import { AdminLayout } from './src/components/layout/AdminLayout';
import { AgentLayout } from './src/components/layout/AgentLayout';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { UserManagement } from './src/pages/admin/UserManagement';
import { FieldManagement } from './src/pages/admin/FieldManagement';
import { FieldUpdates } from './src/pages/admin/FieldUpdates';
import { AgentFields } from './src/pages/agent/AgentFields';
import { AgentUpdates } from './src/pages/agent/AgentUpdates';
import { UserRole } from './src/types';
import { Toaster } from './src/components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="fields" element={<FieldManagement />} />
          <Route path="field-updates" element={<FieldUpdates />} />
        </Route>

        {/* Agent Routes */}
        <Route path="/agent" element={
          <ProtectedRoute allowedRoles={[UserRole.FIELD_AGENT]}>
            <AgentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AgentDashboard />} />
          <Route path="fields" element={<AgentFields />} />
          <Route path="updates" element={<AgentUpdates />} />
        </Route>
        
        {/* Field Detail Routes - Both Admin and Field Agents can access */}
        <Route path="/fields/:id" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.FIELD_AGENT]}>
            <FieldDetail />
          </ProtectedRoute>
        } />

        {/* Fallback - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </BrowserRouter>
  );
}