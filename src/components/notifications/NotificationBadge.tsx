import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
  data?: { offreId?: string };
}

export const NotificationBadge: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  // Mock notifications since store and models are missing
  const notifications: Notification[] = [];

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-1 rounded-full hover:bg-primary-600 transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-3 border-b border-gray-100 font-medium text-gray-700">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Aucune notification</p>
            ) : (
              notifications.slice(0, 5).map(notif => (
                <Link
                  key={notif.id}
                  to={notif.data?.offreId ? `/offres/${notif.data.offreId}` : '#'}
                  className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${!notif.isRead ? 'bg-primary-50' : ''}`}
                  onClick={() => setShowDropdown(false)}
                >
                  <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.body}</p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </Link>
              ))
            )}
          </div>
          {notifications.length > 5 && (
            <div className="p-2 text-center border-t">
              <Link to="/notifications" className="text-primary-600 text-sm" onClick={() => setShowDropdown(false)}>
                Voir toutes
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};