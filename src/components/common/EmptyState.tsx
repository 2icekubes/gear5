import { Link } from 'react-router-dom';

export function EmptyState({ title, body, actionLabel, to = '/rider' }: { title: string; body: string; actionLabel?: string; to?: string }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark">G5</div>
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && (
        <Link className="link-button" to={to}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
