import api from './api';

export interface QualityCheck {
  id: string;
  productName: string;
  lotNumber?: string;
  status: string;
  notes?: string;
  agentId: string;
  agent?: {
    id: string;
    phone: string;
    fullName?: string;
  };
  farmerId: string;
  farmer?: {
    id: string;
    phone: string;
    fullName?: string;
  };
  createdAt: string;
}

export interface CreateQualityCheckData {
  productName: string;
  lotNumber?: string;
  farmerId: string;
  notes?: string;
}

export const qualityService = {
  async getAll(): Promise<QualityCheck[]> {
    const response = await api.get<QualityCheck[]>('/quality');
    return response.data;
  },

  async getById(id: string): Promise<QualityCheck> {
    const response = await api.get<QualityCheck>(`/quality/${id}`);
    return response.data;
  },

  async getByAgent(agentId: string): Promise<QualityCheck[]> {
    const response = await api.get<QualityCheck[]>(`/quality/agent/${agentId}`);
    return response.data;
  },

  async getByFarmer(farmerId: string): Promise<QualityCheck[]> {
    const response = await api.get<QualityCheck[]>(`/quality/farmer/${farmerId}`);
    return response.data;
  },

  async create(data: CreateQualityCheckData): Promise<QualityCheck> {
    const response = await api.post<QualityCheck>('/quality', data);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<QualityCheck> {
    const response = await api.patch<QualityCheck>(`/quality/${id}/status`, { status });
    return response.data;
  },
};
