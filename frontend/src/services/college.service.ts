import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, College } from '@/types';

export const collegeService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<College>>('/colleges', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<College>>(`/colleges/${id}`),

  create: (payload: Omit<College, '_id' | 'createdAt' | 'updatedAt' | 'isActive'>) =>
    api.post<ApiResponse<College>>('/colleges', payload),

  update: (id: string, payload: Partial<College>) =>
    api.put<ApiResponse<College>>(`/colleges/${id}`, payload),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/colleges/${id}`),

  getStats: (id: string) =>
    api.get<ApiResponse<Record<string, number>>>(`/colleges/${id}/stats`),

  getCourses: (id: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<College>>(`/colleges/${id}/courses`, { params }),
};
