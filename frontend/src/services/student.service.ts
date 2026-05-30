import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, User, Enrollment } from '@/types';

export const studentService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; college?: string }) =>
    api.get<PaginatedResponse<User>>('/students', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/students/${id}`),

  getEnrollments: (id: string, params?: { page?: number; limit?: number; status?: string }) =>
    api.get<PaginatedResponse<Enrollment>>(`/students/${id}/enrollments`, { params }),

  getProgress: (id: string) =>
    api.get<ApiResponse<{ courseId: string; progress: number; completedLessons: string[] }[]>>(`/students/${id}/progress`),

  getPerformance: (id: string) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/students/${id}/performance`),

  getAttendance: (id: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<unknown>>(`/students/${id}/attendance`, { params }),

  getCertificates: (id: string) =>
    api.get<ApiResponse<unknown[]>>(`/students/${id}/certificates`),
};
