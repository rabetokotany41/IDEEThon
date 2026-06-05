import api from './api';

export interface PlantDiseaseLog {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  date: string;
}

export interface CreatePlantDiseaseData {
  crop: string;
  disease: string;
  confidence: number;
}

export const plantsService = {
  async getAll(): Promise<PlantDiseaseLog[]> {
    const response = await api.get<PlantDiseaseLog[]>('/plants');
    return response.data;
  },

  async getById(id: string): Promise<PlantDiseaseLog> {
    const response = await api.get<PlantDiseaseLog>(`/plants/${id}`);
    return response.data;
  },

  async getByCrop(crop: string): Promise<PlantDiseaseLog[]> {
    const response = await api.get<PlantDiseaseLog[]>(`/plants/crop/${crop}`);
    return response.data;
  },

  async create(data: CreatePlantDiseaseData): Promise<PlantDiseaseLog> {
    const response = await api.post<PlantDiseaseLog>('/plants', data);
    return response.data;
  },

  async delete(id: string): Promise<PlantDiseaseLog> {
    const response = await api.delete<PlantDiseaseLog>(`/plants/${id}`);
    return response.data;
  },
};
