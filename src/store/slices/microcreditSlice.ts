import { create } from 'zustand';
import { DemandeMicrocredit, CreditStatus } from '../models/microcredit.model';
import { offlineSyncService } from '../services/offlineSync';

interface MicrocreditState {
  credits: DemandeMicrocredit[];
  currentCredit: DemandeMicrocredit | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCredits: (credits: DemandeMicrocredit[]) => void;
  setCurrentCredit: (credit: DemandeMicrocredit | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addCredit: (credit: DemandeMicrocredit) => void;
  updateCredit: (id: string, updates: Partial<DemandeMicrocredit>) => void;
  deleteCredit: (id: string) => void;
  loadCredits: (userId: string) => Promise<void>;
  createCredit: (credit: Omit<DemandeMicrocredit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCreditStatus: (id: string, status: CreditStatus) => void;
}

export const useMicrocreditStore = create<MicrocreditState>((set, get) => ({
  credits: [],
  currentCredit: null,
  isLoading: false,
  error: null,

  setCredits: (credits) => set({ credits }),
  
  setCurrentCredit: (credit) => set({ currentCredit: credit }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addCredit: (credit) => set((state) => ({ credits: [...state.credits, credit] })),
  
  updateCredit: (id, updates) => set((state) => ({
    credits: state.credits.map((credit) =>
      credit.id === id ? { ...credit, ...updates, updatedAt: new Date() } : credit
    ),
    currentCredit: state.currentCredit?.id === id
      ? { ...state.currentCredit, ...updates, updatedAt: new Date() }
      : state.currentCredit,
  })),
  
  deleteCredit: (id) => set((state) => ({
    credits: state.credits.filter((credit) => credit.id !== id),
    currentCredit: state.currentCredit?.id === id ? null : state.currentCredit,
  })),
  
  loadCredits: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const credits = await offlineSyncService.getLocalMicrocredits(userId);
      set({ credits, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des microcrédits', isLoading: false });
    }
  },
  
  createCredit: async (creditData) => {
    set({ isLoading: true, error: null });
    try {
      const newCredit: DemandeMicrocredit = {
        ...creditData,
        id: `credit-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'pending',
      };
      
      // Stocker localement
      await offlineSyncService.storeMicrocredit(newCredit);
      
      // Ajouter à la file de sync
      await offlineSyncService.addToSyncQueue({
        collection: 'microcredits',
        action: 'create',
        documentId: newCredit.id,
        data: newCredit,
      });
      
      set((state) => ({ credits: [...state.credits, newCredit], isLoading: false }));
      return newCredit;
    } catch (error) {
      set({ error: 'Erreur lors de la création de la demande', isLoading: false });
      throw error;
    }
  },
  
  updateCreditStatus: (id, status) => {
    get().updateCredit(id, { statut: status });
  },
}));
