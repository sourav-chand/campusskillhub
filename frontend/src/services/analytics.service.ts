import api from '@/lib/axios';
import type { ApiResponse, DashboardStats, ChartData, LineChartData, PieChartData, BarChartData } from '@/types';

export const analyticsService = {
  getDashboardStats: (params?: { college?: string }) =>
    api.get<ApiResponse<DashboardStats>>('/analytics/dashboard', { params }),

  getEnrollmentTrend: (params?: { days?: number; college?: string }) =>
    api.get<ApiResponse<LineChartData[]>>('/analytics/enrollment-trend', { params }),

  getCourseCompletion: (params?: { college?: string }) =>
    api.get<ApiResponse<ChartData[]>>('/analytics/course-completion', { params }),

  getRevenueAnalytics: (params?: { startDate?: string; endDate?: string; college?: string }) =>
    api.get<ApiResponse<LineChartData[]>>('/analytics/revenue', { params }),

  getStudentDistribution: (params?: { college?: string }) =>
    api.get<ApiResponse<PieChartData[]>>('/analytics/student-distribution', { params }),

  getTopCourses: (params?: { limit?: number; college?: string }) =>
    api.get<ApiResponse<BarChartData[]>>('/analytics/top-courses', { params }),

  getAttendanceAnalytics: (params?: { course?: string; college?: string }) =>
    api.get<ApiResponse<ChartData[]>>('/analytics/attendance', { params }),

  getPerformanceMetrics: (params?: { course?: string; college?: string }) =>
    api.get<ApiResponse<Record<string, number>>>(`/analytics/performance`, { params }),
};
