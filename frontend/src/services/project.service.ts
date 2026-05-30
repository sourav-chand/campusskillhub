import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Project, ProjectMilestone, MentorFeedback } from '@/types';

export const projectService = {
  getAll: (params?: { page?: number; limit?: number; course?: string; status?: string }) =>
    api.get<PaginatedResponse<Project>>('/projects', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`),

  create: (payload: Omit<Project, '_id' | 'createdAt' | 'milestones'>) =>
    api.post<ApiResponse<Project>>('/projects', payload),

  update: (id: string, payload: Partial<Project>) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, payload),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/projects/${id}`),

  addMilestone: (projectId: string, payload: Omit<ProjectMilestone, '_id' | 'feedback' | 'status'>) =>
    api.post<ApiResponse<Project>>(`/projects/${projectId}/milestones`, payload),

  updateMilestone: (projectId: string, milestoneId: string, payload: Partial<ProjectMilestone>) =>
    api.put<ApiResponse<Project>>(`/projects/${projectId}/milestones/${milestoneId}`, payload),

  deleteMilestone: (projectId: string, milestoneId: string) =>
    api.delete<ApiResponse<Project>>(`/projects/${projectId}/milestones/${milestoneId}`),

  addFeedback: (projectId: string, milestoneId: string, payload: { comment: string; rating: number }) =>
    api.post<ApiResponse<MentorFeedback>>(`/projects/${projectId}/milestones/${milestoneId}/feedback`, payload),

  getMyProjects: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<PaginatedResponse<Project>>('/projects/my', { params }),

  getByStudent: (studentId: string) =>
    api.get<ApiResponse<Project[]>>(`/projects/student/${studentId}`),
};
