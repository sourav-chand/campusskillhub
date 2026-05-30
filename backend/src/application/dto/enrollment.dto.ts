import { z } from 'zod';

export const CreateEnrollmentDtoSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  studentId: z.string().uuid('Invalid student ID'),
  collegeId: z.string().uuid('Invalid college ID'),
});

export type CreateEnrollmentDto = z.infer<typeof CreateEnrollmentDtoSchema>;

export interface EnrollmentResponseDto {
  id: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  collegeId: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  startedAt: Date;
  completedAt?: Date;
  status: 'active' | 'completed' | 'dropped' | 'paused';
  grade?: string;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}
