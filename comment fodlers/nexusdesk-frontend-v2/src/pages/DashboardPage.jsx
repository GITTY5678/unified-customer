import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Badge from '../components/ui/Badge'
import { Ticket, Users, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, bg, delta }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      boxShadow: 'var(--shadow-sm)',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        width: '44px', height: '44px',
        borderRadius: 'var(--radius-md)',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color,
        flexShrink: 0,
      }}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-text-primary)', lineHeight: 1 }}>
          {value ?? '—'}
        </div>
        {delta && (
          <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={11} /> {delta}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/tickets/?limit=8'),
      api.get('/customers/?limit=5'),
    ]).then(([t, c]) => {
      setTickets(t.data)
      setCustomers(c.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const open = tickets.filter(t => t.status === 'open').length
  const inProgress = tickets.filter(t => t.status === 'in_progress').length
  const resolved = tickets.filter(t => t.status === 'resolved').length

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '3px' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <StatCard icon={Ticket} label="Total Tickets" value={tickets.length} color="var(--color-accent)" bg="var(--color-accent-light)" delta="Live data" />
        <StatCard icon={Clock} label="Open" value={open} color="var(--color-warning)" bg="var(--color-warning-light)" />
        <StatCard icon={TrendingUp} label="In Progress" value={inProgress} color="var(--color-info)" bg="var(--color-info-light)" />
        <StatCard icon={CheckCircle} label="Resolved" value={resolved} color="var(--color-success)" bg="var(--color-success-light)" />
        <StatCard icon={Users} label="Customers" value={customers.length} color="var(--color-purple)" bg="var(--color-purple-light)" />
      </div>

      {/* Tickets table */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Recent Tickets</h2>
          <button
            onClick={() => navigate('/tickets')}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            View all <ArrowRight size={13} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No tickets yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['ID', 'Subject', 'Status', 'Priority', 'Created'].map(h => (
                  <th key={h} style={{
                    padding: '10px 20px', textAlign: 'left',
                    fontSize: '12px', fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  style={{
                    borderBottom: i < tickets.length - 1 ? '1px solid var(--color-border)' : 'none',
                    cursor: 'pointer',
                    transition: 'background var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    #{String(t.id).padStart(4, '0')}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 500, maxWidth: '280px' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {t.subject}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Badge label={t.status?.replace('_', ' ')} type={t.status} />
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Badge label={t.priority} type={t.priority} />
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
