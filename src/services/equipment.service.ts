import api from './api';

export interface RentalEquipment {
  id: string;
  name: string;
  description?: string;
  pricePerDay: number;
  location: string;
  isAvailable: boolean;
  imageUrl?: string;
  ownerId: string;
  owner?: {
    id: string;
    phone: string;
    fullName?: string;
  };
}

export interface CreateEquipmentData {
  name: string;
  description?: string;
  pricePerDay: number;
  location: string;
  imageUrl?: string;
}

export const equipmentService = {
  async getAll(): Promise<RentalEquipment[]> {
    const response = await api.get<RentalEquipment[]>('/equipment');
    return response.data;
  },

  async getById(id: string): Promise<RentalEquipment> {
    const response = await api.get<RentalEquipment>(`/equipment/${id}`);
    return response.data;
  },

  async getByOwner(ownerId: string): Promise<RentalEquipment[]> {
    const response = await api.get<RentalEquipment[]>(`/equipment/owner/${ownerId}`);
    return response.data;
  },

  async create(data: CreateEquipmentData): Promise<RentalEquipment> {
    const response = await api.post<RentalEquipment>('/equipment', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateEquipmentData>): Promise<RentalEquipment> {
    const response = await api.patch<RentalEquipment>(`/equipment/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<RentalEquipment> {
    const response = await api.delete<RentalEquipment>(`/equipment/${id}`);
    return response.data;
  },
};
