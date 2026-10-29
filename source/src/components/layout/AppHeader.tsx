import { useNavigate } from 'react-router-dom';
import type { MouseEvent, ReactNode } from 'react';
import { LogoMark } from '../../mascot/Mascot';
import samantha from '../../assets/photos/samantha.jpg';
import { Icon } from '../ui/Icon';
export default function AppHeader({
  title,
  home = false,
  back = false,
  onBackClick,
  onProfileClick,
  avatar = true,
  action,
}: {
  title: string;
  home?: boolean;
  back?: boolean;
  onBackClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onProfileClick?: () => void;
  /** Show the profile avatar on the right (default). Profile and Settings turn it off. */
  avatar?: boolean;
  /** Optional round action button shown on the right instead of the avatar. */
  action?: ReactNode;
}) {
  const navigate = useNavigate();
  const goBack = () => navigate('/home');
  return (
    <header className="app-header">
      {back && (
        <button
          className="header-action back-action"
          aria-label="Back"
          onClick={onBackClick ?? goBack}
        >
          <Icon name="back" size={20} />
        </button>
      )}
      <span className={`logo-wrap${home ? ' home-logo' : ''}`}>
        <LogoMark />
      </span>
      <h1 className={title === 'Sessions' ? 'sessions-header-title' : undefined}>{title}</h1>
      {action}
      {avatar && (
        <button
          className="header-avatar-button"
          aria-label="Profile"
          onClick={onProfileClick ?? (() => navigate('/profile'))}
        >
          <img src={samantha} alt="Samantha" />
        </button>
      )}
    </header>
  );
}
