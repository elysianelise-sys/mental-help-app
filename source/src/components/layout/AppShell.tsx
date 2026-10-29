import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { consumeStorageNotice, STORAGE_NOTICE_EVENT } from '../../data/storage';
export default function AppShell() {
  const { pathname } = useLocation();
  const [storageNotice, setStorageNotice] = useState<string | null>(null);
  useEffect(() => {
    const receiveNotice = () => setStorageNotice(consumeStorageNotice());
    window.addEventListener(STORAGE_NOTICE_EVENT, receiveNotice);
    receiveNotice();
    return () => window.removeEventListener(STORAGE_NOTICE_EVENT, receiveNotice);
  }, []);
  return (
    <div className={`app-frame${pathname === '/check-in' ? ' checkin-shell' : ''}`}>
      <Outlet />
      {pathname != '/check-in' && <BottomNav />}
      {storageNotice && (
        <div className="storage-notice" role="status">
          <span>{storageNotice}</span>
          <button aria-label="Dismiss storage message" onClick={() => setStorageNotice(null)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
