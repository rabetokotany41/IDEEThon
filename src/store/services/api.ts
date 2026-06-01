import axios, { AxiosInstance, AxiosError } from 'axios';

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Création de l'instance Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Erreur du serveur
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Pas de réponse du serveur (probablement offline)
      console.error('API No Response:', error.request);
    } else {
      // Erreur de configuration
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Service API pour les appels REST
export const apiService = {
  // Offres
  getOffres: async (params?: any) => {
    const response = await apiClient.get('/offres', { params });
    return response.data;
  },

  getOffre: async (id: string) => {
    const response = await apiClient.get(`/offres/${id}`);
    return response.data;
  },

  createOffre: async (data: any) => {
    const response = await apiClient.post('/offres', data);
    return response.data;
  },

  updateOffre: async (id: string, data: any) => {
    const response = await apiClient.put(`/offres/${id}`, data);
    return response.data;
  },

  deleteOffre: async (id: string) => {
    const response = await apiClient.delete(`/offres/${id}`);
    return response.data;
  },

  // Prix du marché
  getPrix: async (params?: any) => {
    const response = await apiClient.get('/prix', { params });
    return response.data;
  },

  createPrix: async (data: any) => {
    const response = await apiClient.post('/prix', data);
    return response.data;
  },

  getPrixByRegion: async (region: string) => {
    const response = await apiClient.get(`/prix/region/${region}`);
    return response.data;
  },

  getPrixByProduct: async (product: string) => {
    const response = await apiClient.get(`/prix/product/${product}`);
    return response.data;
  },

  // Routes
  getRoutes: async (params?: any) => {
    const response = await apiClient.get('/routes', { params });
    return response.data;
  },

  createRoute: async (data: any) => {
    const response = await apiClient.post('/routes', data);
    return response.data;
  },

  getRoutesByRegion: async (region: string) => {
    const response = await apiClient.get(`/routes/region/${region}`);
    return response.data;
  },

  // Météo
  getMeteo: async (region: string) => {
    const response = await apiClient.get(`/meteo/${region}`);
    return response.data;
  },

  // Matériel
  getMateriel: async (params?: any) => {
    const response = await apiClient.get('/materiel', { params });
    return response.data;
  },

  createMateriel: async (data: any) => {
    const response = await apiClient.post('/materiel', data);
    return response.data;
  },

  createReservation: async (data: any) => {
    const response = await apiClient.post('/materiel/reservation', data);
    return response.data;
  },

  // Microcrédit
  getMicrocredits: async (userId: string) => {
    const response = await apiClient.get(`/microcredits/user/${userId}`);
    return response.data;
  },

  createMicrocredit: async (data: any) => {
    const response = await apiClient.post('/microcredits', data);
    return response.data;
  },

  // Utilisateurs
  getUsers: async (params?: any) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  // Notifications
  getNotifications: async (userId: string) => {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return response.data;
  },

  markNotificationRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Sync (pour offline)
  syncData: async (data: any) => {
    const response = await apiClient.post('/sync', data);
    return response.data;
  },
};

export default apiClient;
