import { create } from 'zustand';
import { Offre, OffreStatus } from '../models/offre.model';
import { offlineSyncService } from '../services/offlineSync';

interface OffreState {
  offres: Offre[];
  currentOffre: Offre | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOffres: (offres: Offre[]) => void;
  setCurrentOffre: (offre: Offre | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addOffre: (offre: Offre) => void;
  updateOffre: (id: string, updates: Partial<Offre>) => void;
  deleteOffre: (id: string) => void;
  loadOffres: (userId?: string) => Promise<void>;
  loadOffre: (id: string) => Promise<void>;
  createOffre: (offre: Omit<Offre, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOffreStatus: (id: string, status: OffreStatus) => void;
}

export const useOffreStore = create<OffreState>((set, get) => ({
  offres: [],
  currentOffre: null,
  isLoading: false,
  error: null,

  setOffres: (offres) => set({ offres }),
  
  setCurrentOffre: (offre) => set({ currentOffre: offre }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addOffre: (offre) => set((state) => ({ offres: [...state.offres, offre] })),
  
  updateOffre: (id, updates) => set((state) => ({
    offres: state.offres.map((offre) =>
      offre.id === id ? { ...offre, ...updates, updatedAt: new Date() } : offre
    ),
    currentOffre: state.currentOffre?.id === id
      ? { ...state.currentOffre, ...updates, updatedAt: new Date() }
      : state.currentOffre,
  })),
  
  deleteOffre: (id) => set((state) => ({
    offres: state.offres.filter((offre) => offre.id !== id),
    currentOffre: state.currentOffre?.id === id ? null : state.currentOffre,
  })),
  
  loadOffres: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const offres = await offlineSyncService.getLocalOffres(userId);
      set({ offres, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des offres', isLoading: false });
    }
  },
  
  loadOffre: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const offres = await offlineSyncService.getLocalOffres();
      const offre = offres.find((o) => o.id === id) || null;
      set({ currentOffre: offre, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement de l\'offre', isLoading: false });
    }
  },
  
  createOffre: async (offreData) => {
    set({ isLoading: true, error: null });
    try {
      const newOffre: Offre = {
        ...offreData,
        id: `offre-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'pending',
      };
      
      // Stocker localement
      await offlineSyncService.storeOffre(newOffre);
      
      // Ajouter à la file de sync
      await offlineSyncService.addToSyncQueue({
        collection: 'offres',
        action: 'create',
        documentId: newOffre.id,
        data: newOffre,
      });
      
      set((state) => ({ offres: [...state.offres, newOffre], isLoading: false }));
      return newOffre;
    } catch (error) {
      set({ error: 'Erreur lors de la création de l\'offre', isLoading: false });
      throw error;
    }
  },
  
  updateOffreStatus: (id, status) => {
    get().updateOffre(id, { status });
  },
}));
