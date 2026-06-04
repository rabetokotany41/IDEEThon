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
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Load initial state from localStorage
const storedToken = localStorage.getItem('agriconnect_token');
const storedUser = localStorage.getItem('agriconnect_user');

export const useAuth = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  role: storedUser ? JSON.parse(storedUser).role : null,
  token: storedToken || null,
  
  login: (user, token) => {
    localStorage.setItem('agriconnect_token', token);
    localStorage.setItem('agriconnect_user', JSON.stringify(user));
    set({ user, role: user.role, token });
  },
  
  logout: () => {
    localStorage.removeItem('agriconnect_token');
    localStorage.removeItem('agriconnect_user');
    set({ user: null, role: null, token: null });
  },
}));
