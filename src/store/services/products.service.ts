import api from './api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl?: string;
  isAvailable: boolean;
  farmerId: string;
  farmer?: {
    id: string;
    phone: string;
    fullName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  unit?: string;
  imageUrl?: string;
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getByFarmer(farmerId: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/farmer/${farmerId}`);
    return response.data;
  },

  async create(data: CreateProductData): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateProductData>): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<Product> {
    const response = await api.delete<Product>(`/products/${id}`);
    return response.data;
  },
};
