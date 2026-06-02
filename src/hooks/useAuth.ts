import { create } from 'zustand';

export type UserRole = 'agriculteur' | 'acheteur' | 'transporteur' | 'agent' | 'admin' | 'superadmin';

interface User {
  id: string;
  phone: string;
  displayName?: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  login: (phone: string, role: UserRole) => void;
  logout: () => void;
}

// Simule un store d'authentification pour le MVP
export const useAuth = create<AuthState>((set) => ({
  user: null,
  role: null,
  login: (phone, role) => set({ 
    user: { id: Math.random().toString(36).substr(2, 9), phone, role, displayName: `User ${role}` },
    role 
  }),
  logout: () => set({ user: null, role: null }),
}));
