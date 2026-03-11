import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inp = {
  width: '100%', padding: '10px 13px',
  border: '1.5px solid var(--color-border)',
  borderRadius: '9px', fontSize: '14px',
  background: 'var(--color-bg)', outline: 'none',
  color: 'var(--color-text-primary)', marginBottom: '14px', display: 'block',
}
const lbl = { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }
const errBox = { background: 'var(--color-danger-light)', border: '1px solid #fca5a5', color: 'var(--color-danger)', padding: '10px 13px', borderRadius: '9px', fontSize: '13px', marginBottom: '14px' }

export default function LoginPage() {
  const [stage, setStage] = useState('choose') // 'choose' | 'agent' | 'customer'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f8f9fb 0%, #eef2ff 100%)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        {stage === 'choose' && <RoleChooser onPick={setStage} />}
        {stage === 'agent' && <AgentAuth onBack={() => setStage('choose')} />}
        {stage === 'customer' && <CustomerAuth onBack={() => setStage('choose')} />}
      </div>
      <RightPanel />
    </div>
  )
}

/* ── Role Chooser ── */
function RoleChooser({ onPick }) {
  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <Logo mb={36} />
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '6px' }}>Who are you?</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Choose your role to continue</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <RoleCard emoji="🧑‍💼" title="I'm an Agent" desc="Support team member — manage tickets, customers, and use AI tools" color="var(--color-accent)" bg="var(--color-accent-light)" onClick={() => onPick('agent')} />
        <RoleCard emoji="🙋" title="I'm a Customer" desc="Submit and track your support tickets" color="var(--color-success)" bg="var(--color-success-light)" onClick={() => onPick('customer')} />
      </div>
    </div>
  )
}

function RoleCard({ emoji, title, desc, color, bg, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', background: hov ? bg : 'var(--color-surface)', border: `2px solid ${hov ? color : 'var(--color-border)'}`, borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', width: '100%' }}>
      <span style={{ fontSize: '28px' }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '3px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{desc}</div>
      </div>
      <span style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>→</span>
    </button>
  )
}

/* ── Agent Auth ── */
function AgentAuth({ onBack }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async () => {
    setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'admin') { navigate('/dashboard'); return }
      if (user.role === 'agent') {
        if (user.is_approved) navigate('/dashboard')
        else setPending(true)
      } else {
        setError('This account is not an agent. Use the Customer portal.')
      }
    } catch (e) { setError(e.response?.data?.detail || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const handleRegister = async () => {
    if (!form.full_name || !form.email || !form.password) { setError('All fields are required'); return }
    setError(''); setLoading(true)
    try {
      await register({ ...form, role: 'agent' })
      setPending(true)
    } catch (e) { setError(e.response?.data?.detail || 'Registration failed') }
    finally { setLoading(false) }
  }

  if (pending) return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <BackBtn onClick={onBack} />
      <div style={{ background: 'var(--color-surface)', borderRadius: '18px', padding: '36px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>⏳</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>Pending Approval</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
          Your agent account is awaiting admin approval.<br />You'll get access once an admin verifies your account.
        </p>
        <p style={{ marginTop: '14px', color: 'var(--color-text-muted)', fontSize: '13px' }}>Contact your admin if you need faster access.</p>
        <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '9px', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          Back to Home
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <BackBtn onClick={onBack} />
      <div style={{ background: 'var(--color-surface)', borderRadius: '18px', padding: '36px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <span style={{ fontSize: '22px' }}>🧑‍💼</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '17px' }}>Agent Portal</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Requires admin approval</div>
          </div>
        </div>
        <TabSwitch tab={tab} setTab={t => { setTab(t); setError('') }} options={[['login', 'Sign In'], ['register', 'Register']]} />
        {error && <div style={errBox}>{error}</div>}
        {tab === 'register' && (
          <><label style={lbl}>Full Name</label><input style={inp} placeholder="Your full name" value={form.full_name} onChange={e => set('full_name', e.target.value)} /></>
        )}
        <label style={lbl}>Email</label>
        <input style={inp} type="email" placeholder="agent@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
        <label style={lbl}>Password</label>
        <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
        <button onClick={tab === 'login' ? handleLogin : handleRegister} disabled={loading}
          style={{ width: '100%', padding: '11px', borderRadius: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Request Agent Access'}
        </button>
        {tab === 'register' && <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>Agent accounts need admin approval before dashboard access.</p>}
      </div>
    </div>
  )
}

/* ── Customer Auth ── */
function CustomerAuth({ onBack }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async () => {
    setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'customer') navigate('/my-tickets')
      else setError('This is not a customer account. Use the Agent portal.')
    } catch (e) { setError(e.response?.data?.detail || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const handleRegister = async () => {
    if (!form.full_name || !form.email || !form.password) { setError('All fields are required'); return }
    setError(''); setLoading(true)
    try {
      await register({ ...form, role: 'customer' })
      await login(form.email, form.password)
      navigate('/my-tickets')
    } catch (e) { setError(e.response?.data?.detail || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <BackBtn onClick={onBack} />
      <div style={{ background: 'var(--color-surface)', borderRadius: '18px', padding: '36px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <span style={{ fontSize: '22px' }}>🙋</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '17px' }}>Customer Portal</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Submit and track your tickets</div>
          </div>
        </div>
        <TabSwitch tab={tab} setTab={t => { setTab(t); setError('') }} options={[['login', 'Sign In'], ['register', 'Sign Up']]} />
        {error && <div style={errBox}>{error}</div>}
        {tab === 'register' && (
          <><label style={lbl}>Full Name</label><input style={inp} placeholder="Your name" value={form.full_name} onChange={e => set('full_name', e.target.value)} /></>
        )}
        <label style={lbl}>Email</label>
        <input style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
        <label style={lbl}>Password</label>
        <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
        <button onClick={tab === 'login' ? handleLogin : handleRegister} disabled={loading}
          style={{ width: '100%', padding: '11px', borderRadius: '10px', background: '#16a34a', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}

/* ── Shared small components ── */
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
      ← Back
    </button>
  )
}

function TabSwitch({ tab, setTab, options }) {
  return (
    <div style={{ display: 'flex', background: 'var(--color-bg)', borderRadius: '9px', padding: '3px', marginBottom: '20px', border: '1px solid var(--color-border)' }}>
      {options.map(([val, label]) => (
        <button key={val} onClick={() => setTab(val)} style={{ flex: 1, padding: '8px', borderRadius: '7px', fontSize: '13px', fontWeight: 600, background: tab === val ? 'var(--color-surface)' : 'transparent', color: tab === val ? 'var(--color-text-primary)' : 'var(--color-text-muted)', border: tab === val ? '1px solid var(--color-border)' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s', boxShadow: tab === val ? 'var(--shadow-sm)' : 'none' }}>
          {label}
        </button>
      ))}
    </div>
  )
}

function Logo({ mb = 24 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: mb }}>
      <div style={{ width: '34px', height: '34px', background: 'var(--color-accent)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '15px' }}>N</div>
      <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>NexusDesk</span>
    </div>
  )
}

function RightPanel() {
  return (
    <div style={{ flex: 1, background: 'linear-gradient(160deg, #1e40af 0%, #2563eb 55%, #3b82f6 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -100, right: -100 }} />
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: 80, left: -60 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '20px' }}>Support Platform</div>
        <h2 style={{ fontSize: '34px', fontWeight: 700, lineHeight: 1.2, marginBottom: '18px', letterSpacing: '-0.5px', maxWidth: '360px' }}>
          Resolve tickets faster with AI-powered support
        </h2>
        <p style={{ fontSize: '15px', opacity: 0.78, lineHeight: 1.65, maxWidth: '340px' }}>
          NexusDesk brings your team, customers, and Claude AI together in one intelligent workspace.
        </p>
        <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
          {[['3×', 'Faster resolution'], ['98%', 'CSAT score'], ['AI', 'Powered by Claude']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>{n}</div>
              <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
