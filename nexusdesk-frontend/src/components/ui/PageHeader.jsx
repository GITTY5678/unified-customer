export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '28px',
    }}>
      <div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.4px',
          marginBottom: '3px',
        }}>{title}</h1>
        {subtitle && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  )
}
