import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../ui/Icon';
const items: [string, string, IconName][] = [
  ['/home', 'Home', 'navHome'],
  ['/sessions', 'Sessions', 'navSessions'],
  ['/explore', 'Explore', 'navExplore'],
  ['/calm', 'Calm', 'navCalm'],
  ['/profile', 'Profile', 'navProfile'],
];
export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map(([to, label, icon]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          aria-label={label}
        >
          <span className="nav-icon">
            <Icon name={icon} />
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
