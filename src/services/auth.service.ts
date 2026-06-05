import api from './api';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  phone: string;
  password: string;
  role: 'AGRICULTEUR' | 'ACHETEUR' | 'TRANSPORTEUR' | 'AGENT' | 'ADMIN';
  fullName?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    phone: string;
    role: string;
    fullName?: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
