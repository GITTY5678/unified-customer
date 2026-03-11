const colorMap = {
  open: { bg: '#eff4ff', color: '#2563eb', dot: '#2563eb' },
  in_progress: { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
  resolved: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  closed: { bg: '#f8f9fb', color: '#5a6278', dot: '#9ca3af' },
  high: { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
  medium: { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
  low: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  admin: { bg: '#f5f3ff', color: '#7c3aed', dot: '#7c3aed' },
  agent: { bg: '#eff4ff', color: '#2563eb', dot: '#2563eb' },
  customer: { bg: '#f0fdf4', color: '#16a34a', dot: '#16a34a' },
}

export default function Badge({ label, type }) {
  const scheme = colorMap[type?.toLowerCase()] || { bg: '#f1f3f7', color: '#5a6278', dot: '#9ca3af' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 9px',
      borderRadius: '99px',
      fontSize: '12px',
      fontWeight: 600,
      background: scheme.bg,
      color: scheme.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: '5px', height: '5px',
        borderRadius: '50%',
        background: scheme.dot,
        flexShrink: 0,
      }} />
      {label}
    </span>
  )
}
