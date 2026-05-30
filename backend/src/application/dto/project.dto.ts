import { z } from 'zod';

export const CreateProjectDtoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  courseId: z.string().uuid('Invalid course ID'),
  studentId: z.string().uuid('Invalid student ID'),
  mentorId: z.string().uuid('Invalid mentor ID').optional(),
  collegeId: z.string().uuid('Invalid college ID'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  objectives: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date').optional(),
  repositoryUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>;

export const UpdateProjectDtoSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  technologies: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date').optional(),
  repositoryUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']).optional(),
});

export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>;

export interface MilestoneDto {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completedAt?: Date;
  status: string;
  order: number;
}

export interface ProjectResponseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  courseId: string;
  courseTitle?: string;
  studentId: string;
  studentName?: string;
  mentorId?: string;
  mentorName?: string;
  collegeId: string;
  collegeName?: string;
  technologies: string[];
  objectives?: string[];
  deliverables?: string[];
  milestones?: MilestoneDto[];
  status: string;
  progress: number;
  startDate: Date;
  endDate?: Date;
  repositoryUrl?: string;
  demoUrl?: string;
  feedback?: string;
  score?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const AddMilestoneDtoSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid due date').optional(),
  order: z.number().int().positive(),
});

export type AddMilestoneDto = z.infer<typeof AddMilestoneDtoSchema>;
