import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function MobileShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/confirm');
  const isRiderDarkPreview = !['/', '/driver', '/admin', '/superadmin'].includes(location.pathname);

  return (
    <div className={`app-stage ${isRiderDarkPreview ? 'app-stage--dark' : ''}`}>
      <main className={`mobile-shell ${hideNav ? 'mobile-shell--no-nav' : ''}`}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
