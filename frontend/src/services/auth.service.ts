import api from '@/lib/axios';
import type { ApiResponse, User } from '@/types';

export const authService = {
  login: (payload: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', payload),

  register: (payload: { firstName: string; lastName: string; email: string; password: string; role?: string; phone?: string; collegeCode?: string }) =>
    api.post<ApiResponse<User>>('/auth/register', payload),

  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (payload: Partial<User>) =>
    api.put<ApiResponse<User>>('/auth/profile', payload),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse<null>>('/auth/change-password', payload),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (payload: { token: string; password: string }) =>
    api.post<ApiResponse<null>>('/auth/reset-password', payload),
};
