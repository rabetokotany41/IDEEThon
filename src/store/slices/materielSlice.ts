import { create } from 'zustand';
import { AnnonceMateriel, ReservationMateriel, MaterielStatus } from '../models/materiel.model';
import { offlineSyncService } from '../services/offlineSync';

interface MaterielState {
  materiel: AnnonceMateriel[];
  currentMateriel: AnnonceMateriel | null;
  reservations: ReservationMateriel[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMateriel: (materiel: AnnonceMateriel[]) => void;
  setCurrentMateriel: (materiel: AnnonceMateriel | null) => void;
  setReservations: (reservations: ReservationMateriel[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMateriel: (materiel: AnnonceMateriel) => void;
  updateMateriel: (id: string, updates: Partial<AnnonceMateriel>) => void;
  deleteMateriel: (id: string) => void;
  loadMateriel: async () => Promise<void>;
  createMateriel: (materiel: Omit<AnnonceMateriel, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  createReservation: (reservation: Omit<ReservationMateriel, 'id' | 'createdAt'>) => Promise<void>;
  loadReservations: (userId: string) => Promise<void>;
  updateMaterielStatus: (id: string, status: MaterielStatus) => void;
}

export const useMaterielStore = create<MaterielState>((set, get) => ({
  materiel: [],
  currentMateriel: null,
  reservations: [],
  isLoading: false,
  error: null,

  setMateriel: (materiel) => set({ materiel }),
  
  setCurrentMateriel: (materiel) => set({ currentMateriel: materiel }),
  
  setReservations: (reservations) => set({ reservations }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addMateriel: (materiel) => set((state) => ({ materiel: [...state.materiel, materiel] })),
  
  updateMateriel: (id, updates) => set((state) => ({
    materiel: state.materiel.map((m) =>
      m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
    ),
    currentMateriel: state.currentMateriel?.id === id
      ? { ...state.currentMateriel, ...updates, updatedAt: new Date() }
      : state.currentMateriel,
  })),
  
  deleteMateriel: (id) => set((state) => ({
    materiel: state.materiel.filter((m) => m.id !== id),
    currentMateriel: state.currentMateriel?.id === id ? null : state.currentMateriel,
  })),
  
  loadMateriel: async () => {
    set({ isLoading: true, error: null });
    try {
      const materiel = await offlineSyncService.getLocalMateriel();
      set({ materiel, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement du matériel', isLoading: false });
    }
  },
  
  createMateriel: async (materielData) => {
    set({ isLoading: true, error: null });
    try {
      const newMateriel: AnnonceMateriel = {
        ...materielData,
        id: `materiel-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'pending',
      };
      
      // Stocker localement
      await offlineSyncService.storeMateriel(newMateriel);
      
      // Ajouter à la file de sync
      await offlineSyncService.addToSyncQueue({
        collection: 'materiel',
        action: 'create',
        documentId: newMateriel.id,
        data: newMateriel,
      });
      
      set((state) => ({ materiel: [...state.materiel, newMateriel], isLoading: false }));
      return newMateriel;
    } catch (error) {
      set({ error: 'Erreur lors de la création de l\'annonce', isLoading: false });
      throw error;
    }
  },
  
  createReservation: async (reservationData) => {
    set({ isLoading: true, error: null });
    try {
      const newReservation: ReservationMateriel = {
        ...reservationData,
        id: `reservation-${Date.now()}`,
        createdAt: new Date(),
      };
      
      set((state) => ({
        reservations: [...state.reservations, newReservation],
        isLoading: false,
      }));
      
      return newReservation;
    } catch (error) {
      set({ error: 'Erreur lors de la création de la réservation', isLoading: false });
      throw error;
    }
  },
  
  loadReservations: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Pour l'instant, on simule le chargement
      const reservations = await offlineSyncService.getLocalMateriel();
      set({ reservations: [], isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des réservations', isLoading: false });
    }
  },
  
  updateMaterielStatus: (id, status) => {
    get().updateMateriel(id, { status });
  },
}));
