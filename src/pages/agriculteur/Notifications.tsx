import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useNotificationStore } from '../../store/slices/notificationSlice';
import { useAuthStore } from '../../store/slices/authSlice';
import { NotificationType } from '../../store/models/notification.model';

export const Notifications: React.FC = () => {
  const { user } = useAuthStore();
  const { notifications, unreadCount, loadNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    }
  }, [user, loadNotifications]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'prix':
        return '💰';
      case 'offre':
        return '🌾';
      case 'meteo':
        return '🌤️';
      case 'route':
        return '🛣️';
      case 'microcredit':
        return '💳';
      case 'systeme':
        return '🔔';
      default:
        return '📌';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'prix':
        return 'bg-green-50 border-green-200';
      case 'offre':
        return 'bg-blue-50 border-blue-200';
      case 'meteo':
        return 'bg-yellow-50 border-yellow-200';
      case 'route':
        return 'bg-orange-50 border-orange-200';
      case 'microcredit':
        return 'bg-purple-50 border-purple-200';
      case 'systeme':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    if (user) {
      await markAllAsRead();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 && `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune notification
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                    !notification.isRead ? 'border-l-4 border-l-primary-500' : ''
                  }`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
