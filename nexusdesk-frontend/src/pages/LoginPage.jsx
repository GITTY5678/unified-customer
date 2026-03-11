import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #f8f9fb 0%, #eef2ff 100%)',
    fontFamily: 'var(--font-sans)',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-xl)',
    padding: '40px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--color-border)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
  },
  logoMark: {
    width: '36px',
    height: '36px',
    background: 'var(--color-accent)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '16px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.3px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '6px',
    letterSpacing: '-0.3px',
  },
  subtext: {
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    marginBottom: '32px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    background: 'var(--color-bg)',
    outline: 'none',
    transition: 'border-color var(--transition)',
    marginBottom: '18px',
  },
  btn: {
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
    transition: 'background var(--transition)',
    letterSpacing: '0.1px',
  },
  error: {
    background: 'var(--color-danger-light)',
    border: '1px solid #fca5a5',
    color: 'var(--color-danger)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    marginBottom: '18px',
  },
  right: {
    flex: 1,
    background: 'linear-gradient(160deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '64px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  rightTagline: {
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: '20px',
    letterSpacing: '-0.5px',
    maxWidth: '380px',
  },
  rightDesc: {
    fontSize: '16px',
    opacity: 0.8,
    lineHeight: 1.6,
    maxWidth: '360px',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
  },
  statsRow: {
    display: 'flex',
    gap: '32px',
    marginTop: '48px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  statLabel: {
    fontSize: '13px',
    opacity: 0.65,
  },
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoMark}>N</div>
            <span style={styles.logoText}>NexusDesk</span>
          </div>

          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subtext}>Sign in to your admin account</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="admin@nexusdesk.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />

            <button
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              type="submit"
              disabled={loading}
              onMouseEnter={e => e.target.style.background = 'var(--color-accent-hover)'}
              onMouseLeave={e => e.target.style.background = 'var(--color-accent)'}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.right}>
        {/* Decorative circles */}
        <div style={{ ...styles.decorCircle, width: 400, height: 400, top: -100, right: -100 }} />
        <div style={{ ...styles.decorCircle, width: 200, height: 200, bottom: 80, left: -60 }} />
        <div style={{ ...styles.decorCircle, width: 100, height: 100, top: '40%', right: '10%' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '20px' }}>
            Support Platform
          </div>
          <h2 style={styles.rightTagline}>
            Resolve tickets faster with AI-powered support
          </h2>
          <p style={styles.rightDesc}>
            NexusDesk brings your team, customers, and AI together in one intelligent workspace.
          </p>

          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <span style={styles.statNum}>3×</span>
              <span style={styles.statLabel}>Faster resolution</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>98%</span>
              <span style={styles.statLabel}>CSAT score</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>AI</span>
              <span style={styles.statLabel}>Powered by Claude</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
