import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterData } from '../services/auth.service';

export type UserRole =
  | 'agriculteur'
  | 'acheteur'
  | 'transporteur'
  | 'agent'
  | 'admin'
  | 'superadmin';

interface User {
  id: string;
  phone: string;
  displayName?: string;
  role: UserRole;
  fullName?: string;
  region?: string;
  village?: string;
  avatarUrl?: string;
  avatar_url?: string; // fallback
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  authenticate: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const storedToken = localStorage.getItem('agriconnect_token');
const storedUser = localStorage.getItem('agriconnect_user');

export const useAuth = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  role: storedUser ? JSON.parse(storedUser).role : null,
  token: storedToken,
  isLoading: false,

  login: (user, token) => {
    localStorage.setItem('agriconnect_token', token);
    localStorage.setItem('agriconnect_user', JSON.stringify(user));

    set({
      user,
      role: user.role,
      token,
    });
  },

  logout: () => {
    localStorage.removeItem('agriconnect_token');
    localStorage.removeItem('agriconnect_user');

    set({
      user: null,
      role: null,
      token: null,
    });
  },

  updateUser: (data) => set((state) => {
    if (!state.user) return state;
    const newUser = { ...state.user, ...data };
    localStorage.setItem('agriconnect_user', JSON.stringify(newUser));
    return { user: newUser };
  }),

  authenticate: async (credentials) => {
    set({ isLoading: true });

    try {
      const response = await authService.login(credentials);

      const user: User = {
        id: response.user.id,
        phone: response.user.phone,
        role: response.user.role.toLowerCase() as UserRole,
        fullName: response.user.fullName,
      };

      localStorage.setItem(
        'agriconnect_user',
        JSON.stringify(user)
      );
      localStorage.setItem(
        'agriconnect_token',
        response.access_token
      );

      set({
        user,
        role: user.role,
        token: response.access_token,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });

    try {
      const response = await authService.register(data);

      const user: User = {
        id: response.user.id,
        phone: response.user.phone,
        role: response.user.role.toLowerCase() as UserRole,
        fullName: response.user.fullName,
      };

      localStorage.setItem(
        'agriconnect_user',
        JSON.stringify(user)
      );
      localStorage.setItem(
        'agriconnect_token',
        response.access_token
      );

      set({
        user,
        role: user.role,
        token: response.access_token,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));