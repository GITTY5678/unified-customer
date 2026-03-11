import { useState, useEffect } from 'react'
import api from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import { Search, Plus, Mail, Phone, User } from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/customers/')
      setCustomers(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '32px 36px' }}>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} total customers`}
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
            <Plus size={15} /> Add Customer
          </button>
        }
      />

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '320px', marginBottom: '20px' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input
          placeholder="Search customers..."
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
          }}
        />
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
          {search ? 'No customers match your search.' : 'No customers yet. Add your first one!'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(c => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </div>
      )}

      {showModal && <AddCustomerModal onClose={() => setShowModal(false)} onCreated={fetchCustomers} />}
    </div>
  )
}

function CustomerCard({ customer: c }) {
  const initials = c.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const colors = ['#2563eb', '#7c3aed', '#16a34a', '#d97706', '#0891b2']
  const color = colors[c.id % colors.length]

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
      transition: 'box-shadow var(--transition-md)',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '16px',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.name || 'Unnamed'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            ID #{c.id}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {c.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <Mail size={13} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</span>
          </div>
        )}
        {c.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <Phone size={13} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} />
            {c.phone}
          </div>
        )}
        {c.company && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <User size={13} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} />
            {c.company}
          </div>
        )}
      </div>

      <div style={{
        marginTop: '14px',
        paddingTop: '14px',
        borderTop: '1px solid var(--color-border)',
        fontSize: '12px',
        color: 'var(--color-text-muted)',
      }}>
        Added {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
  )
}

function AddCustomerModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required'); return }
    setLoading(true)
    try {
      await api.post('/customers/', form)
      onCreated()
      onClose()
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    background: 'var(--color-bg)',
    outline: 'none',
    marginBottom: '14px',
    display: 'block',
    color: 'var(--color-text-primary)',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Add Customer</h2>
        {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}

        {[['name', 'Full Name *', 'text'], ['email', 'Email *', 'email'], ['phone', 'Phone', 'tel'], ['company', 'Company', 'text']].map(([field, label, type]) => (
          <div key={field}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
            <input type={type} style={inputStyle} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Adding...' : 'Add Customer'}
          </button>
        </div>
      </div>
    </div>
  )
}
