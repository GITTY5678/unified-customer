import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import CustomersPage from './pages/CustomersPage'
import SettingsPage from './pages/SettingsPage'
import RegisterPage from "./pages/registerpage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

  {/* public routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* protected routes */}
  <Route
    element={
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/tickets" element={<TicketsPage />} />
    <Route path="/tickets/:id" element={<TicketDetailPage />} />
    <Route path="/customers" element={<CustomersPage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Route>

  {/* default redirect */}
  <Route path="/" element={<Navigate to="/dashboard" replace />} />
  <Route path="*" element={<Navigate to="/dashboard" replace />} />

</Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
