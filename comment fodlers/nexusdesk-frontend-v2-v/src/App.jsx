import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import CustomersPage from './pages/CustomersPage'
import SettingsPage from './pages/SettingsPage'
import CustomerDashboard from './pages/CustomerDashboard'
import AgentApprovalPage from './pages/AgentApprovalPage'

/* Smart redirect based on role */
function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'customer') return <Navigate to="/my-tickets" replace />
  return <Navigate to="/dashboard" replace />
}

/* Protect agent/admin routes */
function AgentRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'customer') return <Navigate to="/my-tickets" replace />
  if (user.role === 'agent' && !user.is_approved) return <PendingScreen />
  return children
}

/* Protect customer route */
function CustomerRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'customer') return <Navigate to="/dashboard" replace />
  return children
}

function PendingScreen() {
  const { logout } = useAuth()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '48px' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>⏳</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>Account Pending Approval</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Your agent account is under review. An admin will approve your account shortly. Check back later or contact your admin directly.
        </p>
        <button onClick={logout} style={{ padding: '10px 24px', background: 'var(--color-accent)', color: '#fff', borderRadius: '9px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomeRedirect />} />

          {/* Customer routes — simple, no sidebar */}
          <Route path="/my-tickets" element={<CustomerRoute><CustomerDashboard /></CustomerRoute>} />

          {/* Agent / Admin routes — with sidebar */}
          <Route path="/" element={<AgentRoute><AppLayout /></AgentRoute>}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="tickets/:id" element={<TicketDetailPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="agents" element={<AgentApprovalPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
