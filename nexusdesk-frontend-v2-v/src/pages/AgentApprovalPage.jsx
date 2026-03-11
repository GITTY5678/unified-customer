import { useState, useEffect } from 'react'
import api from '../services/api'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default function AgentApprovalPanel() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users/?role=agent')
      setAgents(res.data)
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAgents() }, [])

  const approve = async (id) => {
    setActing(id)
    try {
      await api.patch(`/users/${id}`, { is_approved: true })
      await fetchAgents()
    } catch (e) { alert('Failed to approve') }
    finally { setActing(null) }
  }

  const reject = async (id) => {
    if (!confirm('Reject and delete this agent account?')) return
    setActing(id)
    try {
      await api.delete(`/users/${id}`)
      await fetchAgents()
    } catch (e) { alert('Failed to reject') }
    finally { setActing(null) }
  }

  const pending = agents.filter(a => !a.is_approved)
  const approved = agents.filter(a => a.is_approved)

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '3px' }}>Agent Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Approve or reject agent registration requests</p>
      </div>

      {/* Pending approvals */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Clock size={15} style={{ color: 'var(--color-warning)' }} />
          <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Pending Approval</h2>
          {pending.length > 0 && (
            <span style={{ padding: '2px 8px', background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
              {pending.length}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
        ) : pending.length === 0 ? (
          <div style={{ padding: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>
            ✅ No pending requests
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pending.map(agent => (
              <AgentRow key={agent.id} agent={agent} onApprove={() => approve(agent.id)} onReject={() => reject(agent.id)} acting={acting === agent.id} showActions />
            ))}
          </div>
        )}
      </div>

      {/* Approved agents */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <CheckCircle size={15} style={{ color: 'var(--color-success)' }} />
          <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Active Agents</h2>
          <span style={{ padding: '2px 8px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
            {approved.length}
          </span>
        </div>
        {approved.length === 0 ? (
          <div style={{ padding: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>
            No active agents yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {approved.map(agent => (
              <AgentRow key={agent.id} agent={agent} acting={false} showActions={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AgentRow({ agent, onApprove, onReject, acting, showActions }) {
  const initials = agent.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || agent.email[0].toUpperCase()

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: `1px solid ${!agent.is_approved ? '#fde68a' : 'var(--color-border)'}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: agent.is_approved ? 'var(--color-success-light)' : 'var(--color-warning-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '14px',
        color: agent.is_approved ? 'var(--color-success)' : 'var(--color-warning)',
        flexShrink: 0,
      }}>
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{agent.full_name || 'No name'}</div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{agent.email}</div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', marginRight: '8px' }}>
        Registered {new Date(agent.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
      </div>

      {showActions ? (
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={onApprove}
            disabled={acting}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', background: 'var(--color-success)', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: acting ? 0.6 : 1 }}
          >
            <CheckCircle size={13} /> Approve
          </button>
          <button
            onClick={onReject}
            disabled={acting}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: '8px', border: '1px solid #fca5a5', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: acting ? 0.6 : 1 }}
          >
            <XCircle size={13} /> Reject
          </button>
        </div>
      ) : (
        <span style={{ padding: '4px 10px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
          ✓ Active
        </span>
      )}
    </div>
  )
}
