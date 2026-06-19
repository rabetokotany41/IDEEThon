import api from './api';

export interface RoadAlert {
  id: string;
  type: string;
  location: string;
  description?: string;
  severity: string;
  isResolved: boolean;
  createdAt: string;
}

export interface CreateRoadAlertData {
  type: string;
  location: string;
  description?: string;
  severity: string;
}

export const roadsService = {
  async getAll(): Promise<RoadAlert[]> {
    const response = await api.get<RoadAlert[]>('/roads');
    return response.data;
  },

  async getById(id: string): Promise<RoadAlert> {
    const response = await api.get<RoadAlert>(`/roads/${id}`);
    return response.data;
  },

  async create(data: CreateRoadAlertData): Promise<RoadAlert> {
    const response = await api.post<RoadAlert>('/roads', data);
    return response.data;
  },

  async resolveAlert(id: string): Promise<RoadAlert> {
    const response = await api.patch<RoadAlert>(`/roads/${id}/resolve`);
    return response.data;
  },
};
