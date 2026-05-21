import { NavLink } from 'react-router-dom';
import homeIcon from '../../assets/nav/home.svg';
import myRidesIcon from '../../assets/nav/myrides.svg';
import passIcon from '../../assets/nav/pass.svg';
import profileIcon from '../../assets/nav/profile.svg';

const items = [
  { to: '/rider', label: 'Home', icon: homeIcon },
  { to: '/myride', label: 'My Rides', icon: myRidesIcon },
  { to: '/ride-pack', label: 'Passes', icon: passIcon },
  { to: '/profile', label: 'Profile', icon: profileIcon },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/rider'} className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <img className="bottom-nav__icon" src={item.icon} alt="" aria-hidden="true" />
          <small>{item.label}</small>
        </NavLink>
      ))}
    </nav>
  );
}
