import React, { useState, useEffect } from 'react';
const requestNotificationPermission = async () => { return false; };
import { Button } from '../common/Button';

export const PushPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        // Afficher le prompt après quelques secondes
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setIsVisible(false);
    } else {
      setPermission('denied');
    }
  };

  const handleLater = () => {
    setIsVisible(false);
  };

  if (!isVisible || permission !== 'default') return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl border-l-4 border-primary-500 p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">🔔</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Recevoir les alertes</h4>
          <p className="text-sm text-gray-600 mt-1">
            Activez les notifications pour ne rien rater (météo, nouvelles offres, prix).
          </p>
          <div className="flex gap-3 mt-3">
            <Button variant="primary" size="sm" onClick={handleEnable}>Activer</Button>
            <Button variant="ghost" size="sm" onClick={handleLater}>Plus tard</Button>
          </div>
        </div>
        <button onClick={handleLater} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
    </div>
  );
};