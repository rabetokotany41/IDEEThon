import { messagingService } from './firebase';
import { Notification, NotificationType } from '../models/notification.model';
import { offlineSyncService } from './offlineSync';

// Service de gestion des notifications
export const notificationService = {
  // Créer une notification locale
  createLocalNotification: async (notification: Omit<Notification, 'id' | 'createdAt' | 'syncStatus'>) => {
    try {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        createdAt: new Date(),
        syncStatus: 'pending',
      };

      // Stocker localement
      await offlineSyncService.storeNotification(newNotification);

      // Ajouter à la file de sync si nécessaire
      if (notification.userId) {
        await offlineSyncService.addToSyncQueue({
          collection: 'notifications',
          action: 'create',
          documentId: newNotification.id,
          data: newNotification,
        });
      }

      // Afficher une notification navigateur si permission accordée
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      }

      return newNotification;
    } catch (error) {
      console.error('Erreur création notification locale:', error);
      throw error;
    }
  },

  // Créer une notification de prix
  createPriceAlert: async (userId: string, product: string, newPrice: number, region: string) => {
    return notificationService.createLocalNotification({
      userId,
      type: 'prix',
      title: `Alerte prix - ${product}`,
      body: `Nouveau prix pour ${product} à ${region}: ${newPrice} Ar/kg`,
      data: { product, region },
      isRead: false,
    });
  },

  // Créer une notification d'offre
  createOfferAlert: async (userId: string, productName: string, offreId: string) => {
    return notificationService.createLocalNotification({
      userId,
      type: 'offre',
      title: `Nouvelle offre - ${productName}`,
      body: `Une nouvelle offre de ${productName} est disponible`,
      data: { offreId },
      isRead: false,
    });
  },

  // Créer une notification météo
  createWeatherAlert: async (userId: string, alerte: string, region: string) => {
    return notificationService.createLocalNotification({
      userId,
      type: 'meteo',
      title: `Alerte météo - ${region}`,
      body: alerte,
      data: { meteoAlerte: alerte },
      isRead: false,
    });
  },

  // Créer une notification de route
  createRouteAlert: async (userId: string, etat: string, location: string) => {
    return notificationService.createLocalNotification({
      userId,
      type: 'route',
      title: `Alerte route - ${location}`,
      body: `Route signalée comme ${etat}`,
      isRead: false,
    });
  },

  // Créer une notification de microcrédit
  createCreditAlert: async (userId: string, message: string, creditId: string) => {
    return notificationService.createLocalNotification({
      userId,
      type: 'microcredit',
      title: 'Microcrédit',
      body: message,
      data: { creditId },
      isRead: false,
    });
  },

  // Créer une notification système
  createSystemNotification: async (userId: string, title: string, body: string) => {
    return notificationService.createLocalNotification({
      userId,
      type: 'systeme',
      title,
      body,
      isRead: false,
    });
  },

  // Récupérer les notifications d'un utilisateur
  getUserNotifications: async (userId: string) => {
    try {
      return await offlineSyncService.getLocalNotifications(userId);
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return [];
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId: string) => {
    try {
      await offlineSyncService.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Erreur marquage notification lue:', error);
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (userId: string) => {
    try {
      const notifications = await offlineSyncService.getLocalNotifications(userId);
      for (const notif of notifications) {
        if (!notif.isRead) {
          await offlineSyncService.markNotificationAsRead(notif.id);
        }
      }
    } catch (error) {
      console.error('Erreur marquage toutes notifications lues:', error);
    }
  },

  // Demander la permission pour les notifications push
  requestPermission: async () => {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erreur demande permission notification:', error);
      return false;
    }
  },

  // S'abonner aux notifications push Firebase
  subscribeToPush: async () => {
    try {
      const token = await messagingService.requestPermissionAndGetToken();
      if (token) {
        // Stocker le token pour l'envoyer au serveur
        localStorage.setItem('fcmToken', token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Erreur abonnement push:', error);
      return null;
    }
  },

  // Écouter les messages push en premier plan
  onPushMessage: (callback: (payload: any) => void) => {
    return messagingService.onMessage(callback);
  },

  // Envoyer une notification broadcast (admin)
  sendBroadcast: async (title: string, body: string, targetRole?: string, targetRegion?: string) => {
    // Cette fonction serait appelée depuis le backend
    // Pour l'instant, on crée une notification locale pour l'admin
    console.log('Broadcast notification:', { title, body, targetRole, targetRegion });
  },
};
