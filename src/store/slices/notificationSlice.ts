import { create } from 'zustand';
import { Notification } from '../models/notification.model';
import { notificationService } from '../services/notificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loadNotifications: (userId: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'syncStatus'>) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount });
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addNotification: (notification) => set((state) => {
    const newNotifications = [notification, ...state.notifications];
    const newUnreadCount = notification.isRead ? state.unreadCount : state.unreadCount + 1;
    return { notifications: newNotifications, unreadCount: newUnreadCount };
  }),
  
  markAsRead: async (id) => {
    await notificationService.markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  
  markAllAsRead: async () => {
    const { notifications } = get();
    const userId = notifications[0]?.userId;
    if (userId) {
      await notificationService.markAllAsRead(userId);
    }
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },
  
  loadNotifications: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await notificationService.getUserNotifications(userId);
      set({ notifications, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des notifications', isLoading: false });
    }
  },
  
  createNotification: async (notificationData) => {
    try {
      const notification = await notificationService.createLocalNotification(notificationData);
      get().addNotification(notification);
    } catch (error) {
      set({ error: 'Erreur lors de la création de la notification' });
    }
  },
}));
