import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Course } from '@/types';

export const courseService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string; level?: string; college?: string }) =>
    api.get<PaginatedResponse<Course>>('/courses', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Course>>(`/courses/${id}`),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Course>>(`/courses/slug/${slug}`),

  create: (payload: FormData | Record<string, unknown>) =>
    api.post<ApiResponse<Course>>('/courses', payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }),

  update: (id: string, payload: FormData | Record<string, unknown>) =>
    api.put<ApiResponse<Course>>(`/courses/${id}`, payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/courses/${id}`),

  publish: (id: string) =>
    api.patch<ApiResponse<Course>>(`/courses/${id}/publish`),

  unpublish: (id: string) =>
    api.patch<ApiResponse<Course>>(`/courses/${id}/unpublish`),

  getModules: (id: string) =>
    api.get<ApiResponse<Course['modules']>>(`/courses/${id}/modules`),

  addModule: (id: string, payload: { title: string; description?: string; order?: number }) =>
    api.post<ApiResponse<Course>>(`/courses/${id}/modules`, payload),

  updateModule: (courseId: string, moduleId: string, payload: Partial<Course['modules'][0]>) =>
    api.put<ApiResponse<Course>>(`/courses/${courseId}/modules/${moduleId}`, payload),

  deleteModule: (courseId: string, moduleId: string) =>
    api.delete<ApiResponse<Course>>(`/courses/${courseId}/modules/${moduleId}`),

  addLesson: (courseId: string, moduleId: string, payload: Record<string, unknown>) =>
    api.post<ApiResponse<Course>>(`/courses/${courseId}/modules/${moduleId}/lessons`, payload),

  updateLesson: (courseId: string, moduleId: string, lessonId: string, payload: Record<string, unknown>) =>
    api.put<ApiResponse<Course>>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, payload),

  deleteLesson: (courseId: string, moduleId: string, lessonId: string) =>
    api.delete<ApiResponse<Course>>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`),

  getStudyMaterials: (id: string) =>
    api.get<ApiResponse<any[]>>(`/courses/${id}/materials`),

  addStudyMaterial: (id: string, payload: { title: string; description?: string; fileUrl: string; fileType: string; fileSize?: number; moduleId?: string }) =>
    api.post<ApiResponse<any>>(`/courses/${id}/materials`, payload),

  updateStudyMaterial: (courseId: string, materialId: string, payload: Record<string, unknown>) =>
    api.put<ApiResponse<any>>(`/courses/${courseId}/materials/${materialId}`, payload),

  deleteStudyMaterial: (courseId: string, materialId: string) =>
    api.delete<ApiResponse<null>>(`/courses/${courseId}/materials/${materialId}`),
};
