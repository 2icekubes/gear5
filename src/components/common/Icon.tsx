type IconName =
  | 'home'
  | 'bus'
  | 'coupon'
  | 'support'
  | 'more'
  | 'swap'
  | 'vehicle'
  | 'eta'
  | 'tracking'
  | 'qr'
  | 'edit'
  | 'search'
  | 'phone'
  | 'users'
  | 'alert'
  | 'calendar'
  | 'check'
  | 'sun'
  | 'moon'
  | 'chevronRight';

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {name === 'home' && (
        <>
          <path {...common} d="M4 11.5 12 5l8 6.5" />
          <path {...common} d="M6.5 10.5V19h11v-8.5" />
          <path {...common} d="M10 19v-5h4v5" />
        </>
      )}
      {name === 'bus' && (
        <>
          <rect {...common} x="4.5" y="5" width="15" height="12.5" rx="2.5" />
          <path {...common} d="M7.5 8.5h9M7.5 12h9" />
          <path {...common} d="M8 17.5v1.5M16 17.5v1.5" />
          <circle cx="8.5" cy="15.4" r="1.1" fill="currentColor" />
          <circle cx="15.5" cy="15.4" r="1.1" fill="currentColor" />
        </>
      )}
      {name === 'coupon' && (
        <>
          <path {...common} d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
          <path {...common} d="M9 9h6M9 15h6M12 7v10" />
        </>
      )}
      {name === 'support' && (
        <>
          <path {...common} d="M5 12a7 7 0 0 1 14 0" />
          <path {...common} d="M5 12v4a2 2 0 0 0 2 2h1v-6H5Z" />
          <path {...common} d="M19 12v4a2 2 0 0 1-2 2h-1v-6h3Z" />
          <path {...common} d="M14 20h-3" />
        </>
      )}
      {name === 'more' && (
        <>
          <circle cx="6" cy="12" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <circle cx="18" cy="12" r="1.4" fill="currentColor" />
        </>
      )}
      {name === 'swap' && (
        <>
          <path {...common} d="M7 7h10l-3-3" />
          <path {...common} d="M17 17H7l3 3" />
        </>
      )}
      {name === 'vehicle' && (
        <>
          <rect {...common} x="4" y="7" width="16" height="9" rx="3" />
          <path {...common} d="M7 11h10" />
          <circle cx="8" cy="17" r="1.4" fill="currentColor" />
          <circle cx="16" cy="17" r="1.4" fill="currentColor" />
        </>
      )}
      {name === 'eta' && (
        <>
          <circle {...common} cx="12" cy="12" r="7" />
          <path {...common} d="M12 8v4l3 2" />
        </>
      )}
      {name === 'tracking' && (
        <>
          <path {...common} d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle {...common} cx="12" cy="10" r="2" />
        </>
      )}
      {name === 'qr' && (
        <>
          <path {...common} d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5z" />
          <path {...common} d="M14 14h2v2h-2zM18 14h1v5h-5v-1M14 18h2" />
        </>
      )}
      {name === 'edit' && (
        <>
          <path {...common} d="M5 19h4l10-10-4-4L5 15v4Z" />
          <path {...common} d="M13.5 6.5l4 4" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle {...common} cx="10.8" cy="10.8" r="5.8" />
          <path {...common} d="m15 15 4 4" />
        </>
      )}
      {name === 'phone' && (
        <>
          <path {...common} d="M8 5 6 7c-.7.7-.5 3.2 2.8 6.5S14.6 17 15.3 16.3l2-2" />
          <path {...common} d="M13.5 14.5 16 12l3 3-1.8 1.8c-.9.9-5.2.2-9.2-3.8S3.3 4.7 4.2 3.8L6 2l3 3-2.5 2.5" />
        </>
      )}
      {name === 'users' && (
        <>
          <path {...common} d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path {...common} d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path {...common} d="M16 11a3 3 0 1 0 0-6" />
          <path {...common} d="M17 19a4.5 4.5 0 0 0-2-3.7" />
        </>
      )}
      {name === 'alert' && (
        <>
          <path {...common} d="M12 4 3.5 19h17L12 4Z" />
          <path {...common} d="M12 9v4" />
          <path {...common} d="M12 16h.01" />
        </>
      )}
      {name === 'calendar' && (
        <>
          <rect {...common} x="4" y="5" width="16" height="15" rx="2" />
          <path {...common} d="M8 3v4M16 3v4M4 10h16" />
        </>
      )}
      {name === 'check' && (
        <path {...common} d="m5 12 4 4L19 6" />
      )}
      {name === 'sun' && (
        <>
          <circle {...common} cx="12" cy="12" r="4" />
          <path {...common} d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      )}
      {name === 'moon' && (
        <path {...common} d="M20 14.2A7.6 7.6 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
      )}
      {name === 'chevronRight' && (
        <path {...common} d="m9 6 6 6-6 6" />
      )}
    </svg>
  );
}
