import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Badge from '../components/ui/Badge'
import { ArrowLeft, Send, Zap, RefreshCw, User, Bot } from 'lucide-react'

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed']
const PRIORITY_OPTIONS = ['low', 'medium', 'high']

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [updating, setUpdating] = useState(false)
  const bottomRef = useRef(null)

  const fetchTicket = async () => {
    try {
      const [t, m] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/messages`).catch(() => ({ data: [] })),
      ])
      setTicket(t.data)
      setMessages(m.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTicket() }, [id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    try {
      await api.post(`/tickets/${id}/messages`, { content: reply, sender_type: 'agent' })
      setReply('')
      await fetchTicket()
    } catch (e) {
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const getAiSummary = async () => {
    setAiLoading(true)
    setAiSummary('')
    try {
      const res = await api.post(`/tickets/${id}/ai-summary`)
      setAiSummary(res.data.summary || res.data.response || JSON.stringify(res.data))
    } catch (e) {
      setAiSummary('AI summary unavailable. Make sure your CLAUDE_API_KEY is set.')
    } finally {
      setAiLoading(false)
    }
  }

  const updateField = async (field, value) => {
    setUpdating(true)
    try {
      const res = await api.patch(`/tickets/${id}`, { [field]: value })
      setTicket(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading ticket...</div>
  if (!ticket) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-danger)' }}>Ticket not found.</div>

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/tickets')}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--color-text-secondary)', fontSize: '13px',
          background: 'none', border: 'none', cursor: 'pointer',
          marginBottom: '20px', fontWeight: 500,
        }}
      >
        <ArrowLeft size={14} /> Back to Tickets
      </button>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Main panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Ticket header */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  #{String(ticket.id).padStart(4, '0')}
                </span>
                <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>{ticket.subject}</h1>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Badge label={ticket.status?.replace('_', ' ')} type={ticket.status} />
                <Badge label={ticket.priority} type={ticket.priority} />
              </div>
            </div>
            {ticket.description && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{ticket.description}</p>
            )}
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '12px' }}>
              Created {new Date(ticket.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>

          {/* AI Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #f5f3ff, #eff4ff)',
            border: '1px solid #ddd6fe',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: aiSummary ? '12px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-purple)', fontWeight: 600, fontSize: '14px' }}>
                <Zap size={15} /> Claude AI Summary
              </div>
              <button
                onClick={getAiSummary}
                disabled={aiLoading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 12px',
                  background: 'var(--color-purple)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  opacity: aiLoading ? 0.7 : 1,
                }}
              >
                <RefreshCw size={12} style={{ animation: aiLoading ? 'spin 1s linear infinite' : 'none' }} />
                {aiLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {aiSummary && (
              <p style={{ fontSize: '13px', color: '#4c1d95', lineHeight: 1.6 }}>{aiSummary}</p>
            )}
          </div>

          {/* Messages */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, fontSize: '14px' }}>
              Conversation ({messages.length})
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px', fontSize: '13px' }}>No messages yet.</div>
              ) : messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: msg.sender_type === 'agent' ? 'row-reverse' : 'row',
                  }}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    background: msg.sender_type === 'agent' ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: msg.sender_type === 'agent' ? '#fff' : 'var(--color-text-muted)',
                  }}>
                    {msg.sender_type === 'agent' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div style={{
                    maxWidth: '70%',
                    background: msg.sender_type === 'agent' ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    color: msg.sender_type === 'agent' ? '#fff' : 'var(--color-text-primary)',
                    padding: '10px 14px',
                    borderRadius: msg.sender_type === 'agent' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}>
                    {msg.content}
                    <div style={{ fontSize: '11px', opacity: 0.65, marginTop: '4px' }}>
                      {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '10px' }}>
              <input
                placeholder="Type a reply..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  outline: 'none',
                  background: 'var(--color-bg)',
                }}
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 16px',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  opacity: sending || !reply.trim() ? 0.6 : 1,
                }}
              >
                <Send size={13} /> Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={sideCard}>
            <div style={sideCardTitle}>Update Status</div>
            <select
              value={ticket.status}
              onChange={e => updateField('status', e.target.value)}
              disabled={updating}
              style={sideSelect}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div style={sideCard}>
            <div style={sideCardTitle}>Priority</div>
            <select
              value={ticket.priority}
              onChange={e => updateField('priority', e.target.value)}
              disabled={updating}
              style={sideSelect}
            >
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={sideCard}>
            <div style={sideCardTitle}>Details</div>
            {[
              ['Customer ID', ticket.customer_id || '—'],
              ['Assigned to', ticket.assigned_to || 'Unassigned'],
              ['Messages', messages.length],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const sideCard = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '16px',
  boxShadow: 'var(--shadow-sm)',
}

const sideCardTitle = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  marginBottom: '10px',
}

const sideSelect = {
  width: '100%',
  padding: '8px 10px',
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  background: 'var(--color-bg)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  cursor: 'pointer',
}
