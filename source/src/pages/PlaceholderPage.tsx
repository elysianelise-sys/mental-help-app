import { useLocation } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
const titles: Record<string, string> = {
  '/home': 'Home',
  '/calm': 'Calm',
  '/explore': 'Explore',
  '/sessions': 'Sessions',
  '/profile': 'Profile',
  '/check-in': 'Check-in',
};
export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'This page drifted away.';
  return (
    <>
      <AppHeader title={title} home={pathname === '/home'} back={pathname !== '/home'} />
      <main className="page-placeholder">
        <p>
          {title === 'This page drifted away.' ? 'This page drifted away.' : 'Placeholder page'}
        </p>
      </main>
    </>
  );
}
