export function StatusPill({ label, tone = 'green' }: { label: string; tone?: 'green' | 'orange' | 'teal' | 'muted' }) {
  return <span className={`status-pill status-pill--${tone}`}>{label}</span>;
}
