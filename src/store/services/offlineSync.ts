import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SyncQueueItem, SyncAction, SyncCollection } from '../models/syncQueue.model';
import { useState, useEffect } from 'react';

// Interface pour la base de données IndexedDB
interface AgriConnectDB extends DBSchema {
  syncQueue: {
    key: string;
    value: SyncQueueItem;
    indexes: { 'by-collection': string; 'by-status': string };
  };
  offres: {
    key: string;
    value: any;
    indexes: { 'by-userId': string; 'by-status': string };
  };
  prix: {
    key: string;
    value: any;
    indexes: { 'by-region': string; 'by-product': string };
  };
  routes: {
    key: string;
    value: any;
    indexes: { 'by-region': string };
  };
  meteo: {
    key: string;
    value: any;
  };
  materiel: {
    key: string;
    value: any;
    indexes: { 'by-status': string };
  };
  microcredits: {
    key: string;
    value: any;
    indexes: { 'by-userId': string };
  };
  notifications: {
    key: string;
    value: any;
    indexes: { 'by-userId': string; 'by-read': string };
  };
}

const DB_NAME = 'AgriConnectDB';
const DB_VERSION = 1;

let db: IDBPDatabase<AgriConnectDB> | null = null;

// Initialisation de la base de données IndexedDB
export const initDB = async () => {
  if (db) return db;

  try {
    db = await openDB<AgriConnectDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Sync Queue
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncQueueStore.createIndex('by-collection', 'collection');
          syncQueueStore.createIndex('by-status', 'syncStatus');
        }

        // Offres
        if (!db.objectStoreNames.contains('offres')) {
          const offresStore = db.createObjectStore('offres', { keyPath: 'id' });
          offresStore.createIndex('by-userId', 'userId');
          offresStore.createIndex('by-status', 'status');
        }

        // Prix
        if (!db.objectStoreNames.contains('prix')) {
          const prixStore = db.createObjectStore('prix', { keyPath: 'id' });
          prixStore.createIndex('by-region', 'region');
          prixStore.createIndex('by-product', 'product');
        }

        // Routes
        if (!db.objectStoreNames.contains('routes')) {
          const routesStore = db.createObjectStore('routes', { keyPath: 'id' });
          routesStore.createIndex('by-region', 'region');
        }

        // Météo
        if (!db.objectStoreNames.contains('meteo')) {
          db.createObjectStore('meteo', { keyPath: 'region' });
        }

        // Matériel
        if (!db.objectStoreNames.contains('materiel')) {
          const materielStore = db.createObjectStore('materiel', { keyPath: 'id' });
          materielStore.createIndex('by-status', 'status');
        }

        // Microcrédits
        if (!db.objectStoreNames.contains('microcredits')) {
          const microcreditsStore = db.createObjectStore('microcredits', { keyPath: 'id' });
          microcreditsStore.createIndex('by-userId', 'userId');
        }

        // Notifications
        if (!db.objectStoreNames.contains('notifications')) {
          const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notificationsStore.createIndex('by-userId', 'userId');
          notificationsStore.createIndex('by-read', 'isRead');
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Erreur initialisation IndexedDB:', error);
    throw error;
  }
};

// Service de synchronisation offline
export const offlineSyncService = {
  // Ajouter un élément à la file de synchronisation
  addToSyncQueue: async (item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retryCount'>) => {
    try {
      const database = await initDB();
      const syncItem: SyncQueueItem = {
        ...item,
        id: `${item.collection}-${item.documentId}-${Date.now()}`,
        createdAt: new Date(),
        retryCount: 0,
      };
      await database.put('syncQueue', syncItem);
      return syncItem;
    } catch (error) {
      console.error('Erreur ajout sync queue:', error);
      throw error;
    }
  },

  // Récupérer tous les éléments en attente de synchronisation
  getPendingSyncItems: async () => {
    try {
      const database = await initDB();
      return await database.getAllFromIndex('syncQueue', 'by-status', 'pending');
    } catch (error) {
      console.error('Erreur récupération sync queue:', error);
      return [];
    }
  },

  // Marquer un élément comme synchronisé
  markAsSynced: async (id: string) => {
    try {
      const database = await initDB();
      const item = await database.get('syncQueue', id);
      if (item) {
        await database.delete('syncQueue', id);
      }
    } catch (error) {
      console.error('Erreur marquage sync:', error);
    }
  },

  // Incrémenter le compteur de retry
  incrementRetry: async (id: string) => {
    try {
      const database = await initDB();
      const item = await database.get('syncQueue', id);
      if (item) {
        item.retryCount += 1;
        item.lastRetryAt = new Date();
        await database.put('syncQueue', item);
      }
    } catch (error) {
      console.error('Erreur increment retry:', error);
    }
  },

  // Stocker localement une offre
  storeOffre: async (offre: any) => {
    try {
      const database = await initDB();
      await database.put('offres', offre);
    } catch (error) {
      console.error('Erreur stockage offre:', error);
    }
  },

  // Récupérer les offres locales
  getLocalOffres: async (userId?: string) => {
    try {
      const database = await initDB();
      if (userId) {
        return await database.getAllFromIndex('offres', 'by-userId', userId);
      }
      return await database.getAll('offres');
    } catch (error) {
      console.error('Erreur récupération offres:', error);
      return [];
    }
  },

  // Stocker localement les prix
  storePrix: async (prix: any) => {
    try {
      const database = await initDB();
      await database.put('prix', prix);
    } catch (error) {
      console.error('Erreur stockage prix:', error);
    }
  },

  // Récupérer les prix locaux
  getLocalPrix: async (region?: string, product?: string) => {
    try {
      const database = await initDB();
      if (region) {
        return await database.getAllFromIndex('prix', 'by-region', region);
      }
      if (product) {
        return await database.getAllFromIndex('prix', 'by-product', product);
      }
      return await database.getAll('prix');
    } catch (error) {
      console.error('Erreur récupération prix:', error);
      return [];
    }
  },

  // Stocker localement les routes
  storeRoute: async (route: any) => {
    try {
      const database = await initDB();
      await database.put('routes', route);
    } catch (error) {
      console.error('Erreur stockage route:', error);
    }
  },

  // Récupérer les routes locales
  getLocalRoutes: async (region?: string) => {
    try {
      const database = await initDB();
      if (region) {
        return await database.getAllFromIndex('routes', 'by-region', region);
      }
      return await database.getAll('routes');
    } catch (error) {
      console.error('Erreur récupération routes:', error);
      return [];
    }
  },

  // Stocker localement la météo
  storeMeteo: async (meteo: any) => {
    try {
      const database = await initDB();
      await database.put('meteo', meteo);
    } catch (error) {
      console.error('Erreur stockage météo:', error);
    }
  },

  // Récupérer la météo locale
  getLocalMeteo: async (region: string) => {
    try {
      const database = await initDB();
      return await database.get('meteo', region);
    } catch (error) {
      console.error('Erreur récupération météo:', error);
      return null;
    }
  },

  // Stocker localement le matériel
  storeMateriel: async (materiel: any) => {
    try {
      const database = await initDB();
      await database.put('materiel', materiel);
    } catch (error) {
      console.error('Erreur stockage matériel:', error);
    }
  },

  // Récupérer le matériel local
  getLocalMateriel: async () => {
    try {
      const database = await initDB();
      return await database.getAll('materiel');
    } catch (error) {
      console.error('Erreur récupération matériel:', error);
      return [];
    }
  },

  // Stocker localement les microcrédits
  storeMicrocredit: async (credit: any) => {
    try {
      const database = await initDB();
      await database.put('microcredits', credit);
    } catch (error) {
      console.error('Erreur stockage microcrédit:', error);
    }
  },

  // Récupérer les microcrédits locaux
  getLocalMicrocredits: async (userId: string) => {
    try {
      const database = await initDB();
      return await database.getAllFromIndex('microcredits', 'by-userId', userId);
    } catch (error) {
      console.error('Erreur récupération microcrédits:', error);
      return [];
    }
  },

  // Stocker localement une notification
  storeNotification: async (notification: any) => {
    try {
      const database = await initDB();
      await database.put('notifications', notification);
    } catch (error) {
      console.error('Erreur stockage notification:', error);
    }
  },

  // Récupérer les notifications locales
  getLocalNotifications: async (userId: string) => {
    try {
      const database = await initDB();
      return await database.getAllFromIndex('notifications', 'by-userId', userId);
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return [];
    }
  },

  // Marquer une notification comme lue
  markNotificationAsRead: async (id: string) => {
    try {
      const database = await initDB();
      const notification = await database.get('notifications', id);
      if (notification) {
        notification.isRead = true;
        await database.put('notifications', notification);
      }
    } catch (error) {
      console.error('Erreur marquage notification lue:', error);
    }
  },

  // Vider la file de synchronisation
  clearSyncQueue: async () => {
    try {
      const database = await initDB();
      await database.clear('syncQueue');
    } catch (error) {
      console.error('Erreur vidage sync queue:', error);
    }
  },

  // Synchroniser toutes les données en attente
  syncAll: async (apiService: any) => {
    const pendingItems = await offlineSyncService.getPendingSyncItems();
    
    for (const item of pendingItems) {
      try {
        // Appeler l'API appropriée selon la collection et l'action
        let endpoint = '';
        let method = '';
        
        switch (item.collection) {
          case 'offres':
            endpoint = '/offres';
            break;
          case 'prix':
            endpoint = '/prix';
            break;
          case 'routes':
            endpoint = '/routes';
            break;
          case 'materiel':
            endpoint = '/materiel';
            break;
          case 'microcredits':
            endpoint = '/microcredits';
            break;
          default:
            console.warn('Collection inconnue:', item.collection);
            continue;
        }

        if (item.action === 'create') {
          await apiService.post(endpoint, item.data);
        } else if (item.action === 'update') {
          await apiService.put(`${endpoint}/${item.documentId}`, item.data);
        } else if (item.action === 'delete') {
          await apiService.delete(`${endpoint}/${item.documentId}`);
        }

        // Marquer comme synchronisé
        await offlineSyncService.markAsSynced(item.id);
      } catch (error) {
        console.error('Erreur synchronisation item:', item.id, error);
        await offlineSyncService.incrementRetry(item.id);
      }
    }
  },
};

// Hook pour détecter le statut de connexion
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  return isOnline;
};
