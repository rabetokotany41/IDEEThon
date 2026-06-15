import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, AlertCircle, Truck, ShoppingBag,
  Sprout, DollarSign, CheckCheck, Trash2, XCircle,
  CloudRain, Sun, Wind, Thermometer
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'delivery' | 'loan' | 'quality' | 'weather';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link?: string;
  metadata?: any;
}

const iconMap: Record<string, React.ElementType> = {
  info: Bell,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  order: ShoppingBag,
  delivery: Truck,
  loan: DollarSign,
  quality: Sprout,
  weather: CloudRain,
};

const colorMap: Record<string, string> = {
  info: 'text-blue-400 bg-blue-400/10',
  success: 'text-emerald-400 bg-emerald-400/10',
  warning: 'text-orange-400 bg-orange-400/10',
  error: 'text-red-400 bg-red-400/10',
  order: 'text-indigo-400 bg-indigo-400/10',
  delivery: 'text-cyan-400 bg-cyan-400/10',
  loan: 'text-green-400 bg-green-400/10',
  quality: 'text-purple-400 bg-purple-400/10',
  weather: 'text-sky-400 bg-sky-400/10',
};

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (reset = false) => {
    if (!user) return;
    try {
      setError(null);
      const currentPage = reset ? 1 : page;
      const response = await api.get('/notifications', {
        params: {
          page: currentPage,
          limit: 20,
          filter: selectedFilter, // 'all' | 'unread' — matches backend @Query('filter')
        },
      });
      // Adapter selon la structure de votre backend
      const data = response.data;
      const newNotifs = data.notifications || data.data || data || [];
      const more = data.hasMore ?? data.hasNext ?? (newNotifs.length === 20);
      
      setHasMore(more);
      setNotifications(prev => reset ? newNotifs : [...prev, ...newNotifs]);
      if (reset) setPage(1);
    } catch (err: any) {
      console.error('Erreur chargement notifications', err);
      setError(err.response?.data?.message || 'Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  }, [user, page, selectedFilter]);

  // Seed examples then load on first mount
  useEffect(() => {
    if (!user) return;
    const init = async () => {
      try {
        // Ensures role-appropriate example notifications exist (no-op if already present)
        await api.post('/notifications/seed-examples');
      } catch {
        // Non-blocking: ignore seed errors
      }
      fetchNotifications(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Reload when filter changes (after initial mount)
  useEffect(() => {
    if (!user) return;
    fetchNotifications(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  // Chargement supplémentaire (pagination)
  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage(p => p + 1);
    fetchNotifications();
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Sélectionner l'icône appropriée pour la météo (si type "weather")
  const getWeatherIcon = (notification: Notification) => {
    if (notification.type !== 'weather') return iconMap[notification.type] || Bell;
    const metadata = notification.metadata;
    if (!metadata) return CloudRain;
    const code = metadata.weatherCode;
    if (code === 0) return Sun;
    if (code === 1 || code === 2) return Sun;
    if (code === 3) return CloudRain;
    if (code >= 51 && code <= 67) return CloudRain;
    if (code >= 80) return CloudRain;
    if (metadata.windSpeed > 30) return Wind;
    if (metadata.temperature > 35) return Thermometer;
    return CloudRain;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-green-400" />
            Notifications
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setSelectedFilter('unread')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedFilter === 'unread'
                ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Non lues
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/70 hover:bg-white/10 flex items-center gap-2"
            >
              <CheckCheck size={16} />
              Tout lire
            </button>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      {loading && notifications.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400" />
        </div>
      ) : error ? (
        <div className="text-center text-red-400 p-8 bg-white/5 rounded-2xl">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{error}</p>
          <button
            onClick={() => fetchNotifications(true)}
            className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Réessayer
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif) => {
              let Icon = iconMap[notif.type] || Bell;
              if (notif.type === 'weather') Icon = getWeatherIcon(notif);
              const colorClass = colorMap[notif.type] || colorMap.info;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                  className={`
                    relative group rounded-xl p-4 border transition-all duration-200
                    ${notif.is_read
                      ? 'bg-white/5 border-white/10 hover:bg-white/8'
                      : 'bg-green-500/5 border-green-500/30 hover:bg-green-500/10'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl ${colorClass}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className={`font-semibold ${notif.is_read ? 'text-white/70' : 'text-white'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs text-white/40 shrink-0">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm mt-1">{notif.message}</p>
                      {notif.link && (
                        <a
                          href={notif.link}
                          className="inline-block mt-2 text-xs text-green-400 hover:underline"
                        >
                          Voir détails →
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.is_read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1.5 rounded-lg text-white/50 hover:text-green-400"
                          title="Marquer comme lu"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1.5 rounded-lg text-white/50 hover:text-red-400"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all"
              >
                {loading ? 'Chargement...' : 'Charger plus'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;