import api from '../axios';
import { ApiResponse } from '@/types/api';

interface ExampleData {
  id: string;
  name: string;
}

export const exampleService = {
  getExample: async (id: string): Promise<ApiResponse<ExampleData>> => {
    return api.get(`/examples/${id}`);
  },

  createExample: async (data: Omit<ExampleData, 'id'>): Promise<ApiResponse<ExampleData>> => {
    return api.post('/examples', data);
  },

  updateExample: async (id: string, data: Partial<ExampleData>): Promise<ApiResponse<ExampleData>> => {
    return api.put(`/examples/${id}`, data);
  },

  deleteExample: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/examples/${id}`);
  },
};