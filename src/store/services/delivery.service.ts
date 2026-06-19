import api from './api';

export interface DeliveryMission {
  id: string;
  origin: string;
  destination: string;
  distance?: number;
  status: string;
  deliveryPrice: number;
  orderId: string;
  order?: {
    id: string;
    totalAmount: number;
    status: string;
  };
  transporterId?: string;
  transporter?: {
    id: string;
    phone: string;
    fullName?: string;
  };
  createdAt: string;
}

export interface CreateDeliveryData {
  orderId: string;
  origin: string;
  destination: string;
  deliveryPrice: number;
  distance?: number;
}

export const deliveryService = {
  async getAll(): Promise<DeliveryMission[]> {
    const response = await api.get<DeliveryMission[]>('/delivery');
    return response.data;
  },

  async getById(id: string): Promise<DeliveryMission> {
    const response = await api.get<DeliveryMission>(`/delivery/${id}`);
    return response.data;
  },

  async getByTransporter(transporterId: string): Promise<DeliveryMission[]> {
    const response = await api.get<DeliveryMission[]>(`/delivery/transporter/${transporterId}`);
    return response.data;
  },

  async getByOrderId(orderId: string): Promise<DeliveryMission> {
    const response = await api.get<DeliveryMission>(`/delivery/order/${orderId}`);
    return response.data;
  },

  async create(data: CreateDeliveryData): Promise<DeliveryMission> {
    const response = await api.post<DeliveryMission>('/delivery', data);
    return response.data;
  },

  async assignTransporter(id: string, transporterId: string): Promise<DeliveryMission> {
    const response = await api.patch<DeliveryMission>(`/delivery/${id}/assign`, { transporterId });
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<DeliveryMission> {
    const response = await api.patch<DeliveryMission>(`/delivery/${id}/status`, { status });
    return response.data;
  },
};
