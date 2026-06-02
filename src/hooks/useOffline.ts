import { useState, useEffect } from 'react';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncPending, setSyncPending] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingSync = () => setSyncPending(prev => prev + 1);
  
  const forceSync = () => {
    if (isOnline) {
      setTimeout(() => setSyncPending(0), 1000); // Simulate sync
    } else {
      alert("Impossible de synchroniser en mode hors-ligne.");
    }
  };

  return { isOnline, syncPending, addPendingSync, forceSync };
};
