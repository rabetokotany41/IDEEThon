import { create } from 'zustand';
import { User, UserRole } from '../models/user.model';
import { authService } from '../services/firebase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  login: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true, error: null });
  },
  
  logout: async () => {
    try {
      await authService.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error) {
      set({ error: 'Erreur lors de la déconnexion' });
    }
  },
  
  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },
}));

// Hook pour vérifier si l'utilisateur a un rôle spécifique
export const useHasRole = (role: UserRole) => {
  const user = useAuthStore((state) => state.user);
  return user?.role === role;
};

// Hook pour vérifier si l'utilisateur a un des rôles
export const useHasAnyRole = (roles: UserRole[]) => {
  const user = useAuthStore((state) => state.user);
  return user ? roles.includes(user.role) : false;
};
