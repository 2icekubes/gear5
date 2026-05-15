import { NavLink } from 'react-router-dom';
import { Icon } from '../common/Icon';

const items = [
  { to: '/rider', label: 'Home', icon: 'home' },
  { to: '/myride', label: 'myRides', icon: 'bus' },
  { to: '/ride-pack', label: 'Ride Pack', icon: 'coupon' },
  { to: '/profile', label: 'More', icon: 'more' },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/rider'} className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Icon name={item.icon} />
          <small>{item.label}</small>
        </NavLink>
      ))}
    </nav>
  );
}
