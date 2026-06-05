import api from './api';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  buyerId: string;
  buyer?: {
    id: string;
    phone: string;
    fullName?: string;
  };
  items: OrderItem[];
  delivery?: {
    id: string;
    origin: string;
    destination: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export const ordersService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async getByBuyer(buyerId: string): Promise<Order[]> {
    const response = await api.get<Order[]>(`/orders/buyer/${buyerId}`);
    return response.data;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};
