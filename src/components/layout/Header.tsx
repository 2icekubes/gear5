import { Link } from 'react-router-dom';

export function Header({ title, subtitle, backTo }: { title: string; subtitle?: string; backTo?: string }) {
  return (
    <header className={`page-header ${backTo ? 'page-header--with-back' : ''}`}>
      {backTo && (
        <div>
          <Link className="icon-link" to={backTo} aria-label="Go back">
            ‹
          </Link>
        </div>
      )}
      <div className="page-header__copy">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}
