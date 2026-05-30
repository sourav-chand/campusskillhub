import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export const reportService = {
  getStudentReport: (studentId: string, params?: { startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/reports/students/${studentId}`, { params }),

  getCourseReport: (courseId: string) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/reports/courses/${courseId}`),

  getCollegeReport: (collegeId: string, params?: { startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/reports/colleges/${collegeId}`, { params }),

  getAttendanceReport: (params: { course?: string; startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<Record<string, unknown>>>('/reports/attendance', { params }),

  getPerformanceReport: (params?: { course?: string; college?: string }) =>
    api.get<ApiResponse<Record<string, unknown>>>('/reports/performance', { params }),

  exportReport: (reportType: string, params: Record<string, unknown>) =>
    api.get<Blob>(`/reports/export/${reportType}`, { params, responseType: 'blob' }),
};
