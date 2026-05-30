import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Notification } from '@/types';

export const notificationService = {
  getAll: (params?: { page?: number; limit?: number; isRead?: boolean }) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params }),

  getUnreadCount: () =>
    api.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    api.put<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put<ApiResponse<null>>('/notifications/read-all'),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/notifications/${id}`),

  create: (payload: { recipient: string; title: string; message: string; type: Notification['type']; link?: string }) =>
    api.post<ApiResponse<Notification>>('/notifications', payload),
};
