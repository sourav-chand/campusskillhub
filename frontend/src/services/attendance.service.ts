import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Attendance } from '@/types';

export const attendanceService = {
  getAll: (params?: { page?: number; limit?: number; course?: string; date?: string; status?: string }) =>
    api.get<PaginatedResponse<Attendance>>('/attendance', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Attendance>>(`/attendance/${id}`),

  markAttendance: (payload: { student: string; course: string; date: string; status: Attendance['status']; remarks?: string }) =>
    api.post<ApiResponse<Attendance>>('/attendance', payload),

  markBulk: (payload: { course: string; date: string; records: { student: string; status: Attendance['status'] }[] }) =>
    api.post<ApiResponse<Attendance[]>>('/attendance/bulk', payload),

  update: (id: string, payload: Partial<Attendance>) =>
    api.put<ApiResponse<Attendance>>(`/attendance/${id}`, payload),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/attendance/${id}`),

  getByCourse: (courseId: string, params?: { page?: number; limit?: number; date?: string }) =>
    api.get<PaginatedResponse<Attendance>>(`/attendance/course/${courseId}`, { params }),

  getByStudent: (studentId: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Attendance>>(`/attendance/student/${studentId}`, { params }),

  getStats: (courseId: string) =>
    api.get<ApiResponse<{ present: number; absent: number; late: number; total: number }>>(`/attendance/stats/${courseId}`),
};
