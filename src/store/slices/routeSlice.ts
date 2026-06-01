import { create } from 'zustand';
import { SignalementRoute, RouteEtat } from '../models/route.model';
import { offlineSyncService } from '../services/offlineSync';

interface RouteState {
  routes: SignalementRoute[];
  currentRoute: SignalementRoute | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRoutes: (routes: SignalementRoute[]) => void;
  setCurrentRoute: (route: SignalementRoute | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addRoute: (route: SignalementRoute) => void;
  updateRoute: (id: string, updates: Partial<SignalementRoute>) => void;
  deleteRoute: (id: string) => void;
  loadRoutes: (region?: string) => Promise<void>;
  createRoute: (route: Omit<SignalementRoute, 'id' | 'createdAt'>) => Promise<void>;
  getRoutesByEtat: (etat: RouteEtat) => SignalementRoute[];
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  currentRoute: null,
  isLoading: false,
  error: null,

  setRoutes: (routes) => set({ routes }),
  
  setCurrentRoute: (route) => set({ currentRoute: route }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
  
  updateRoute: (id, updates) => set((state) => ({
    routes: state.routes.map((route) =>
      route.id === id ? { ...route, ...updates } : route
    ),
    currentRoute: state.currentRoute?.id === id
      ? { ...state.currentRoute, ...updates }
      : state.currentRoute,
  })),
  
  deleteRoute: (id) => set((state) => ({
    routes: state.routes.filter((route) => route.id !== id),
    currentRoute: state.currentRoute?.id === id ? null : state.currentRoute,
  })),
  
  loadRoutes: async (region) => {
    set({ isLoading: true, error: null });
    try {
      const routes = await offlineSyncService.getLocalRoutes(region);
      set({ routes, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des routes', isLoading: false });
    }
  },
  
  createRoute: async (routeData) => {
    set({ isLoading: true, error: null });
    try {
      const newRoute: SignalementRoute = {
        ...routeData,
        id: `route-${Date.now()}`,
        createdAt: new Date(),
        syncStatus: 'pending',
      };
      
      // Stocker localement
      await offlineSyncService.storeRoute(newRoute);
      
      // Ajouter à la file de sync
      await offlineSyncService.addToSyncQueue({
        collection: 'routes',
        action: 'create',
        documentId: newRoute.id,
        data: newRoute,
      });
      
      set((state) => ({ routes: [...state.routes, newRoute], isLoading: false }));
      return newRoute;
    } catch (error) {
      set({ error: 'Erreur lors de la création du signalement', isLoading: false });
      throw error;
    }
  },
  
  getRoutesByEtat: (etat) => {
    return get().routes.filter((route) => route.etat === etat);
  },
}));
