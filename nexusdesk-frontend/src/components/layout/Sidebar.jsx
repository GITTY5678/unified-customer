import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Ticket, Users, Settings,
  LogOut, ChevronRight, Bell, Zap
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--color-accent)',
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '15px',
          flexShrink: 0,
        }}>N</div>
        <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>NexusDesk</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px', marginBottom: '6px' }}>
          Menu
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2px',
              fontWeight: isActive ? 600 : 400,
              fontSize: '14px',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-accent-light)' : 'transparent',
              transition: 'all var(--transition)',
              textDecoration: 'none',
            })}
          >
            <Icon size={16} strokeWidth={isActive => isActive ? 2.5 : 1.8} />
            {label}
          </NavLink>
        ))}

        {/* AI Badge */}
        <div style={{
          margin: '20px 0 6px',
          fontSize: '11px', fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.8px',
          padding: '0 10px',
        }}>
          AI Features
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #f5f3ff, #eff4ff)',
          border: '1px solid #ddd6fe',
          color: 'var(--color-purple)',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          <Zap size={15} />
          Claude AI Active
        </div>
      </nav>

      {/* User footer */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '4px',
          background: 'var(--color-bg)',
        }}>
          <div style={{
            width: '30px', height: '30px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '12px',
            flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.full_name || 'Admin'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-danger-light)'; e.currentTarget.style.color = 'var(--color-danger)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
