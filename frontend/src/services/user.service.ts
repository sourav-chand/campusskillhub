import api from '@/lib/axios';
import type { ApiResponse, User } from '@/types';

export const userService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<User[]>>('/users', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  deactivate: (id: string) =>
    api.patch<ApiResponse<void>>(`/users/${id}/deactivate`),
};
