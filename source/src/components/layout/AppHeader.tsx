import { useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';
import { LogoMark } from '../../mascot/Mascot';
import samantha from '../../assets/photos/samantha.jpg';
import { Icon } from '../ui/Icon';
export default function AppHeader({
  title,
  home = false,
  back = false,
  onBackClick,
  onProfileClick,
}: {
  title: string;
  home?: boolean;
  back?: boolean;
  onBackClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onProfileClick?: () => void;
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
      <button
        className="header-avatar-button"
        aria-label="Profile"
        onClick={onProfileClick ?? (() => navigate('/profile'))}
      >
        <img src={samantha} alt="Samantha" />
      </button>
    </header>
  );
}
