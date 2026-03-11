import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/ui/Badge'
import { Plus, Ticket, Clock, CheckCircle, LogOut } from 'lucide-react'

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await api.get('/tickets/my')
      setTickets(res.data)
    } catch {
      // fallback: try generic with customer filter
      try {
        const res = await api.get('/tickets/')
        setTickets(res.data)
      } catch (e) { console.error(e) }
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchTickets() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const open = tickets.filter(t => t.status === 'open').length
  const inProgress = tickets.filter(t => t.status === 'in_progress').length
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Top nav */}
      <header style={{
        background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
        padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: 'var(--color-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>N</div>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>NexusDesk</span>
          <span style={{ padding: '2px 8px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '99px', fontSize: '11px', fontWeight: 600 }}>Customer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>👋 {user?.full_name || user?.email}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'none', fontSize: '13px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      <div style={{ padding: '36px 32px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '3px' }}>My Support Tickets</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Track your requests and view replies from our team</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', background: 'var(--color-accent)', color: '#fff', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            <Plus size={15} /> New Ticket
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {[
            { icon: Ticket, label: 'Total Tickets', value: tickets.length, color: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
            { icon: Clock, label: 'Open / In Progress', value: open + inProgress, color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
            { icon: CheckCircle, label: 'Resolved', value: resolved, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                <Icon size={18} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tickets list */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading your tickets...</div>
          ) : tickets.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎟️</div>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>No tickets yet</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>Submit a ticket and our team will get back to you.</div>
              <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: 'var(--color-accent)', color: '#fff', borderRadius: '9px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Submit your first ticket
              </button>
            </div>
          ) : (
            <div>
              {tickets.map((t, i) => (
                <div key={t.id} style={{ padding: '18px 22px', borderBottom: i < tickets.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>#{String(t.id).padStart(4, '0')}</span>
                      <Badge label={t.status?.replace('_', ' ')} type={t.status} />
                      <Badge label={t.priority} type={t.priority} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</div>
                    {t.description && <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && <NewTicketModal onClose={() => setShowModal(false)} onCreated={fetchTickets} />}
    </div>
  )
}

function NewTicketModal({ onClose, onCreated }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ subject: '', priority: 'medium', channel: 'web' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.subject.trim()) { setError('Subject is required'); return }
    setLoading(true)
    try {
      await api.post('/tickets/', {
        subject: form.subject,
        priority: form.priority,
        channel: form.channel,
        customer_id: user.customer_id,
      })
      onCreated(); onClose()
    } catch (e) { setError(e.response?.data?.detail || 'Failed to submit ticket') }
    finally { setLoading(false) }
  }

  const inp2 = { width: '100%', padding: '9px 12px', border: '1.5px solid var(--color-border)', borderRadius: '9px', fontSize: '13px', background: 'var(--color-bg)', outline: 'none', marginBottom: '14px', display: 'block', color: 'var(--color-text-primary)' }
  const lbl2 = { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'var(--color-surface)', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '460px', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>Submit a Support Ticket</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Describe your issue and our team will get back to you.</p>
        {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '10px 13px', borderRadius: '9px', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
        
        <label style={lbl2}>Subject *</label>
        <input style={inp2} placeholder="Brief summary of your issue" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
        
        <label style={lbl2}>Channel</label>
        <select style={inp2} value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}>
          <option value="web">Web</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <label style={lbl2}>Priority</label>
        <select style={inp2} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low — general question</option>
          <option value="medium">Medium — some impact</option>
          <option value="high">High — urgent issue</option>
        </select>

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '9px', border: '1.5px solid var(--color-border)', background: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: '9px', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </div>
    </div>
  )
}