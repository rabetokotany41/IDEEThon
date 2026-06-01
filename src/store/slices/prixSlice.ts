import { create } from 'zustand';
import { PrixMarche } from '../models/prix.model';
import { offlineSyncService } from '../services/offlineSync';

interface PrixState {
  prix: PrixMarche[];
  currentPrix: PrixMarche | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPrix: (prix: PrixMarche[]) => void;
  setCurrentPrix: (prix: PrixMarche | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addPrix: (prix: PrixMarche) => void;
  updatePrix: (id: string, updates: Partial<PrixMarche>) => void;
  deletePrix: (id: string) => void;
  loadPrix: (region?: string, product?: string) => Promise<void>;
  createPrix: (prix: Omit<PrixMarche, 'id' | 'reportedAt'>) => Promise<void>;
  getPrixByProduct: (product: string) => PrixMarche[];
  getPrixByRegion: (region: string) => PrixMarche[];
}

export const usePrixStore = create<PrixState>((set, get) => ({
  prix: [],
  currentPrix: null,
  isLoading: false,
  error: null,

  setPrix: (prix) => set({ prix }),
  
  setCurrentPrix: (prix) => set({ currentPrix: prix }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addPrix: (prix) => set((state) => ({ prix: [...state.prix, prix] })),
  
  updatePrix: (id, updates) => set((state) => ({
    prix: state.prix.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    ),
    currentPrix: state.currentPrix?.id === id
      ? { ...state.currentPrix, ...updates }
      : state.currentPrix,
  })),
  
  deletePrix: (id) => set((state) => ({
    prix: state.prix.filter((p) => p.id !== id),
    currentPrix: state.currentPrix?.id === id ? null : state.currentPrix,
  })),
  
  loadPrix: async (region, product) => {
    set({ isLoading: true, error: null });
    try {
      const prix = await offlineSyncService.getLocalPrix(region, product);
      set({ prix, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des prix', isLoading: false });
    }
  },
  
  createPrix: async (prixData) => {
    set({ isLoading: true, error: null });
    try {
      const newPrix: PrixMarche = {
        ...prixData,
        id: `prix-${Date.now()}`,
        reportedAt: new Date(),
        syncStatus: 'pending',
      };
      
      // Stocker localement
      await offlineSyncService.storePrix(newPrix);
      
      // Ajouter à la file de sync
      await offlineSyncService.addToSyncQueue({
        collection: 'prix',
        action: 'create',
        documentId: newPrix.id,
        data: newPrix,
      });
      
      set((state) => ({ prix: [...state.prix, newPrix], isLoading: false }));
      return newPrix;
    } catch (error) {
      set({ error: 'Erreur lors de la création du prix', isLoading: false });
      throw error;
    }
  },
  
  getPrixByProduct: (product) => {
    return get().prix.filter((p) => p.product === product);
  },
  
  getPrixByRegion: (region) => {
    return get().prix.filter((p) => p.region === region);
  },
}));
