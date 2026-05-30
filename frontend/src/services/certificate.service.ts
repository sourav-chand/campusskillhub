import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Certificate } from '@/types';

export const certificateService = {
  getAll: (params?: { page?: number; limit?: number; student?: string; course?: string }) =>
    api.get<PaginatedResponse<Certificate>>('/certificates', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Certificate>>(`/certificates/${id}`),

  getByCertificateId: (certificateId: string) =>
    api.get<ApiResponse<Certificate>>(`/certificates/verify/${certificateId}`),

  generate: (payload: { student: string; course: string; grade: string; totalScore: number }) =>
    api.post<ApiResponse<Certificate>>('/certificates', payload),

  download: (id: string) =>
    api.get<Blob>(`/certificates/${id}/download`, { responseType: 'blob' }),

  verify: (certificateId: string) =>
    api.get<ApiResponse<{ valid: boolean; certificate: Certificate }>>(`/certificates/verify/${certificateId}`),

  getMyCertificates: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Certificate>>('/certificates/my', { params }),
};
