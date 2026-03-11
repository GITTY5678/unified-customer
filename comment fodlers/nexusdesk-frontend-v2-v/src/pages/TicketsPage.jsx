import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Badge from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'
import { Search, Plus, Filter, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = ['all', 'open', 'in_progress', 'resolved', 'closed']
const PRIORITY_OPTIONS = ['all', 'high', 'medium', 'low']

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status !== 'all') params.append('status', status)
      if (priority !== 'all') params.append('priority', priority)
      const res = await api.get(`/tickets/?${params.toString()}`)
      setTickets(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTickets() }, [status, priority])

  const filtered = tickets.filter(t =>
    t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    String(t.id).includes(search)
  )

  return (
    <div style={{ padding: '32px 36px' }}>
      <PageHeader
        title="Tickets"
        subtitle={`${tickets.length} total tickets`}
        actions={
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px',
              background: 'var(--color-accent)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
            }}
          >
            <Plus size={15} /> New Ticket
          </button>
        }
      />

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 34px',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              background: 'var(--color-surface)',
              outline: 'none',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.replace('_', ' ')}</option>)}
        </select>

        <select value={priority} onChange={e => setPriority(e.target.value)} style={selectStyle}>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p === 'all' ? 'All Priority' : p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No tickets found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['#', 'Subject', 'Customer', 'Status', 'Priority', 'Created'].map(h => (
                  <th key={h} style={{
                    padding: '10px 20px', textAlign: 'left',
                    fontSize: '12px', fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    #{String(t.id).padStart(4, '0')}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 500 }}>
                    <div style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.subject}
                    </div>
                    {t.description && (
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                    {t.customer?.name || t.customer_id || '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Badge label={t.status?.replace('_', ' ')} type={t.status} />
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Badge label={t.priority} type={t.priority} />
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--color-text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showModal && <CreateTicketModal onClose={() => setShowModal(false)} onCreated={fetchTickets} />}
    </div>
  )
}

function CreateTicketModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium', customer_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.subject.trim()) { setError('Subject is required'); return }
    setLoading(true)
    try {
      await api.post('/tickets/', {
        ...form,
        customer_id: form.customer_id ? parseInt(form.customer_id) : undefined,
      })
      onCreated()
      onClose()
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Create New Ticket</h2>

        {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}

        <label style={labelStyle}>Subject *</label>
        <input style={inputStyle} placeholder="Brief description of the issue" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />

        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} placeholder="Detailed description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        <label style={labelStyle}>Priority</label>
        <select style={inputStyle} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label style={labelStyle}>Customer ID (optional)</label>
        <input style={inputStyle} type="number" placeholder="e.g. 1" value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} />

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  )
}

const selectStyle = {
  padding: '9px 12px',
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  background: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  cursor: 'pointer',
}

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
}

const modalStyle = {
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-xl)',
  padding: '28px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: 'var(--shadow-lg)',
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  background: 'var(--color-bg)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  marginBottom: '14px',
  display: 'block',
}
