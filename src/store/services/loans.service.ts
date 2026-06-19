import api from './api';

export interface Loan {
  id: string;
  amount: number;
  durationMonths: number;
  interestRate: number;
  purpose: string;
  status: string;
  farmerId: string;
  farmer?: {
    id: string;
    phone: string;
    fullName?: string;
  };
  createdAt: string;
}

export interface CreateLoanData {
  amount: number;
  durationMonths: number;
  purpose: string;
}

export const loansService = {
  async getAll(): Promise<Loan[]> {
    const response = await api.get<Loan[]>('/loans');
    return response.data;
  },

  async getById(id: string): Promise<Loan> {
    const response = await api.get<Loan>(`/loans/${id}`);
    return response.data;
  },

  async getByFarmer(farmerId: string): Promise<Loan[]> {
    const response = await api.get<Loan[]>(`/loans/farmer/${farmerId}`);
    return response.data;
  },

  async create(data: CreateLoanData): Promise<Loan> {
    const response = await api.post<Loan>('/loans', data);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Loan> {
    const response = await api.patch<Loan>(`/loans/${id}/status`, { status });
    return response.data;
  },
};
