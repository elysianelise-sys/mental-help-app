import { Link } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
export default function NotFound() {
  return (
    <>
      <AppHeader title="This page drifted away." back />
      <main className="page-placeholder">
        <p>This page drifted away.</p>
        <Link className="secondary-button" to="/home">
          Go home
        </Link>
      </main>
    </>
  );
}
