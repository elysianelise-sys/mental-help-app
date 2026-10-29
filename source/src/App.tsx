import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import KitchenSink from './pages/KitchenSink';
import NotFound from './pages/NotFound';
import CheckInPage from './features/checkin/CheckInPage';
import HomePage from './features/home/HomePage';
import CalmPage from './features/calm/CalmPage';
import BuySessionsPage from './features/sessions/BuySessionsPage';
import ExplorePage from './features/explore/ExplorePage';
import ProfilePage from './features/profile/ProfilePage';
import SettingsPage from './features/settings/SettingsPage';
import CalendarPage from './features/calendar/CalendarPage';
import { AudioProvider } from './providers/AudioProvider';
import { CheckInProvider } from './providers/CheckInProvider';
import { PreferencesProvider } from './providers/PreferencesProvider';
import { PurchaseProvider } from './providers/PurchaseProvider';
export default function App() {
  return (
    <PreferencesProvider>
      <CheckInProvider>
        <PurchaseProvider>
          <AudioProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/calm" element={<CalmPage />} />
                <Route path="/sessions" element={<BuySessionsPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/check-in" element={<CheckInPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              {import.meta.env.DEV && <Route path="/dev/kitchen-sink" element={<KitchenSink />} />}
            </Routes>
          </AudioProvider>
        </PurchaseProvider>
      </CheckInProvider>
    </PreferencesProvider>
  );
}
