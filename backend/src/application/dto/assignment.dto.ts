import { z } from 'zod';

export const CreateAssignmentDtoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  courseId: z.string().uuid('Invalid course ID'),
  createdById: z.string().uuid('Invalid creator ID'),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid due date'),
  maxScore: z.number().int().positive('Max score must be positive').default(100),
  passingScore: z.number().int().positive().default(40),
  attachments: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.string(),
  })).optional(),
  instructions: z.string().max(5000).optional(),
});

export type CreateAssignmentDto = z.infer<typeof CreateAssignmentDtoSchema>;

export const SubmitAssignmentDtoSchema = z.object({
  assignmentId: z.string().uuid('Invalid assignment ID'),
  studentId: z.string().uuid('Invalid student ID'),
  content: z.string().max(10000).optional(),
  attachments: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.string(),
  })).min(1, 'At least one attachment is required').optional(),
  notes: z.string().max(2000).optional(),
});

export type SubmitAssignmentDto = z.infer<typeof SubmitAssignmentDtoSchema>;

export const GradeAssignmentDtoSchema = z.object({
  submissionId: z.string().uuid('Invalid submission ID'),
  gradedById: z.string().uuid('Invalid grader ID'),
  score: z.number().int().min(0, 'Score cannot be negative'),
  feedback: z.string().max(5000).optional(),
  remarks: z.string().max(2000).optional(),
});

export type GradeAssignmentDto = z.infer<typeof GradeAssignmentDtoSchema>;
