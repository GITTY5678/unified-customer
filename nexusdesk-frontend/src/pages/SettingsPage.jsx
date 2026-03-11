import { useAuth } from '../context/AuthContext'
import { Settings, Shield, Zap, Bell } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div style={{ padding: '32px 36px', maxWidth: '720px' }}>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <Section icon={Shield} title="Account">
        <Field label="Email" value={user?.email} />
        <Field label="Role" value={user?.role} badge />
        <Field label="Account ID" value={`#${user?.id}`} mono />
      </Section>

      <Section icon={Zap} title="AI Integration">
        <Field label="AI Provider" value="Anthropic Claude" />
        <Field label="Model" value="claude-3-haiku / claude-3-opus" />
        <Field label="Status" value="Active" green />
        <div style={{ marginTop: '12px', padding: '12px 14px', background: 'var(--color-accent-light)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--color-accent)' }}>
          Claude AI is integrated via your <code style={{ fontFamily: 'var(--font-mono)' }}>CLAUDE_API_KEY</code> in <code style={{ fontFamily: 'var(--font-mono)' }}>.env</code>. AI summaries are available on each ticket detail page.
        </div>
      </Section>

      <Section icon={Bell} title="API">
        <Field label="Swagger Docs" value="http://127.0.0.1:8000/docs" link />
        <Field label="Base URL" value="http://127.0.0.1:8000" mono />
        <Field label="Auth" value="JWT Bearer Token" />
      </Section>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '16px',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: '8px',
        fontWeight: 700, fontSize: '14px',
      }}>
        <Icon size={15} style={{ color: 'var(--color-accent)' }} />
        {title}
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  )
}

function Field({ label, value, mono, badge, green, link }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid var(--color-border)',
      fontSize: '13px',
    }}>
      <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{value}</a>
      ) : badge ? (
        <span style={{ padding: '3px 10px', background: 'var(--color-accent-light)', color: 'var(--color-accent)', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>{value}</span>
      ) : (
        <span style={{
          fontFamily: mono ? 'var(--font-mono)' : 'inherit',
          fontSize: mono ? '12px' : '13px',
          fontWeight: 600,
          color: green ? 'var(--color-success)' : 'var(--color-text-primary)',
        }}>{value || '—'}</span>
      )}
    </div>
  )
}
