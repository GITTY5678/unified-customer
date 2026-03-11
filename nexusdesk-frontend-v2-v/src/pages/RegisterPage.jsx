import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #f8f9fb 0%, #eef2ff 100%)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'var(--color-accent)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '16px',
            }}>N</div>
            <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.3px' }}>NexusDesk</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '6px' }}>
            Create account
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Sign in</Link>
          </p>

          {error && (
            <div style={{
              background: 'var(--color-danger-light)',
              border: '1px solid #fca5a5',
              color: 'var(--color-danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              marginBottom: '18px',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { field: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Harihara Suthan' },
              { field: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { field: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label style={{
                  display: 'block', fontSize: '13px', fontWeight: 600,
                  color: 'var(--color-text-primary)', marginBottom: '6px',
                }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={set(field)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    background: 'var(--color-bg)',
                    outline: 'none',
                    marginBottom: '16px',
                    color: 'var(--color-text-primary)',
                    transition: 'border-color 150ms ease',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '4px',
                opacity: loading ? 0.7 : 1,
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = 'var(--color-accent-hover)' }}
              onMouseLeave={e => e.target.style.background = 'var(--color-accent)'}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: 80, left: -60 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '20px' }}>
            Get Started Free
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.5px', maxWidth: '380px' }}>
            Your team's support hub starts here
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.8, lineHeight: 1.6, maxWidth: '360px' }}>
            Set up your NexusDesk account and start managing tickets, customers, and AI-powered responses in minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '40px' }}>
            {['Manage tickets and customers', 'AI summaries powered by Claude', 'Real-time conversation threads'].map(feature => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', flexShrink: 0,
                }}>✓</div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
