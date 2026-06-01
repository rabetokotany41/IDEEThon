import { create } from 'zustand';
import { SyncQueueItem } from '../models/syncQueue.model';
import { offlineSyncService } from '../services/offlineSync';
import { apiService } from '../services/api';

interface SyncState {
  pendingItems: SyncQueueItem[];
  isSyncing: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  
  // Actions
  setPendingItems: (items: SyncQueueItem[]) => void;
  setSyncing: (syncing: boolean) => void;
  setError: (error: string | null) => void;
  loadPendingItems: () => Promise<void>;
  syncAll: () => Promise<void>;
  clearQueue: () => Promise<void>;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  pendingItems: [],
  isSyncing: false,
  lastSyncAt: null,
  error: null,

  setPendingItems: (items) => set({ pendingItems: items }),
  
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  
  setError: (error) => set({ error }),
  
  loadPendingItems: async () => {
    try {
      const items = await offlineSyncService.getPendingSyncItems();
      set({ pendingItems: items });
    } catch (error) {
      set({ error: 'Erreur lors du chargement de la file de sync' });
    }
  },
  
  syncAll: async () => {
    set({ isSyncing: true, error: null });
    try {
      await offlineSyncService.syncAll(apiService);
      set({ 
        isSyncing: false, 
        lastSyncAt: new Date(),
        pendingItems: [],
      });
    } catch (error) {
      set({ error: 'Erreur lors de la synchronisation', isSyncing: false });
    }
  },
  
  clearQueue: async () => {
    try {
      await offlineSyncService.clearSyncQueue();
      set({ pendingItems: [] });
    } catch (error) {
      set({ error: 'Erreur lors du vidage de la file de sync' });
    }
  },
}));
