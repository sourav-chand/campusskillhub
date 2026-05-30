import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, MCQTest, MCQAttempt, CodingAssessment, CodingSubmission, Assignment, AssignmentSubmission } from '@/types';

export const assessmentService = {
  // ===================== MCQ Tests =====================
  getMCQTests: (params?: { page?: number; limit?: number; course?: string }) =>
    api.get<PaginatedResponse<MCQTest>>('/assessments/mcq', { params }),

  getMCQTestById: (id: string) =>
    api.get<ApiResponse<MCQTest>>(`/assessments/mcq/${id}`),

  createMCQTest: (payload: Omit<MCQTest, '_id' | 'createdAt'>) =>
    api.post<ApiResponse<MCQTest>>('/assessments/mcq', payload),

  updateMCQTest: (id: string, payload: Partial<MCQTest>) =>
    api.put<ApiResponse<MCQTest>>(`/assessments/mcq/${id}`, payload),

  deleteMCQTest: (id: string) =>
    api.delete<ApiResponse<null>>(`/assessments/mcq/${id}`),

  // ===================== MCQ Attempts =====================
  startMCQAttempt: (testId: string) =>
    api.post<ApiResponse<MCQAttempt>>(`/assessments/mcq/${testId}/start`),

  submitMCQAttempt: (attemptId: string, payload: { answers: number[]; timeTaken: number }) =>
    api.post<ApiResponse<MCQAttempt>>(`/assessments/mcq/attempts/${attemptId}/submit`, payload),

  getMCQAttempts: (testId: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<MCQAttempt>>(`/assessments/mcq/${testId}/attempts`, { params }),

  // ===================== Coding Assessments =====================
  getCodingAssessments: (params?: { page?: number; limit?: number; course?: string }) =>
    api.get<PaginatedResponse<CodingAssessment>>('/assessments/coding', { params }),

  getCodingAssessmentById: (id: string) =>
    api.get<ApiResponse<CodingAssessment>>(`/assessments/coding/${id}`),

  createCodingAssessment: (payload: Omit<CodingAssessment, '_id' | 'createdAt'>) =>
    api.post<ApiResponse<CodingAssessment>>('/assessments/coding', payload),

  updateCodingAssessment: (id: string, payload: Partial<CodingAssessment>) =>
    api.put<ApiResponse<CodingAssessment>>(`/assessments/coding/${id}`, payload),

  deleteCodingAssessment: (id: string) =>
    api.delete<ApiResponse<null>>(`/assessments/coding/${id}`),

  // ===================== Coding Submissions =====================
  submitCoding: (assessmentId: string, payload: { code: string; language: string }) =>
    api.post<ApiResponse<CodingSubmission>>(`/assessments/coding/${assessmentId}/submit`, payload),

  getCodingSubmissions: (assessmentId: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<CodingSubmission>>(`/assessments/coding/${assessmentId}/submissions`, { params }),

  // ===================== Assignments =====================
  getAssignments: (params?: { page?: number; limit?: number; course?: string }) =>
    api.get<PaginatedResponse<Assignment>>('/assessments/assignments', { params }),

  getAssignmentById: (id: string) =>
    api.get<ApiResponse<Assignment>>(`/assessments/assignments/${id}`),

  createAssignment: (payload: FormData | Record<string, unknown>) =>
    api.post<ApiResponse<Assignment>>('/assessments/assignments', payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }),

  updateAssignment: (id: string, payload: FormData | Record<string, unknown>) =>
    api.put<ApiResponse<Assignment>>(`/assessments/assignments/${id}`, payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }),

  deleteAssignment: (id: string) =>
    api.delete<ApiResponse<null>>(`/assessments/assignments/${id}`),

  // ===================== Assignment Submissions =====================
  submitAssignment: (assignmentId: string, payload: FormData | { content?: string }) =>
    api.post<ApiResponse<AssignmentSubmission>>(`/assessments/assignments/${assignmentId}/submit`, payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }),

  getSubmissions: (assignmentId: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<AssignmentSubmission>>(`/assessments/assignments/${assignmentId}/submissions`, { params }),

  gradeSubmission: (submissionId: string, payload: { score: number; feedback?: string }) =>
    api.put<ApiResponse<AssignmentSubmission>>(`/assessments/submissions/${submissionId}/grade`, payload),
};
