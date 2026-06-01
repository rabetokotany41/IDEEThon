import { create } from 'zustand';
import { MeteoRegion } from '../models/meteo.model';
import { offlineSyncService } from '../services/offlineSync';

interface MeteoState {
  meteoData: Record<string, MeteoRegion>;
  currentMeteo: MeteoRegion | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMeteoData: (meteoData: Record<string, MeteoRegion>) => void;
  setCurrentMeteo: (meteo: MeteoRegion | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadMeteo: (region: string) => Promise<void>;
  updateMeteo: (region: string, meteo: MeteoRegion) => void;
}

export const useMeteoStore = create<MeteoState>((set, get) => ({
  meteoData: {},
  currentMeteo: null,
  isLoading: false,
  error: null,

  setMeteoData: (meteoData) => set({ meteoData }),
  
  setCurrentMeteo: (meteo) => set({ currentMeteo: meteo }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  loadMeteo: async (region) => {
    set({ isLoading: true, error: null });
    try {
      const meteo = await offlineSyncService.getLocalMeteo(region);
      if (meteo) {
        set((state) => ({
          meteoData: { ...state.meteoData, [region]: meteo },
          currentMeteo: meteo,
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: 'Erreur lors du chargement de la météo', isLoading: false });
    }
  },
  
  updateMeteo: (region, meteo) => {
    set((state) => ({
      meteoData: { ...state.meteoData, [region]: meteo },
      currentMeteo: state.currentMeteo?.region === region ? meteo : state.currentMeteo,
    }));
    
    // Stocker localement
    offlineSyncService.storeMeteo(meteo);
  },
}));
