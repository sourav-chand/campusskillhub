import { z } from 'zod';

const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean().default(false),
  description: z.string().max(500).optional(),
  points: z.number().int().positive().default(1),
});

export const CreateCodingAssessmentDtoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  courseId: z.string().uuid('Invalid course ID'),
  createdById: z.string().uuid('Invalid creator ID'),
  language: z.enum(['javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'go', 'rust']),
  templateCode: z.string().optional(),
  testCases: z.array(TestCaseSchema).min(1, 'At least one test case is required'),
  duration: z.number().int().positive('Duration in minutes').optional(),
  passingScore: z.number().int().positive().default(50),
  maxAttempts: z.number().int().positive().default(3),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  constraints: z.string().max(1000).optional(),
  hints: z.array(z.string()).optional(),
  solution: z.string().optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid deadline').optional(),
});

export type CreateCodingAssessmentDto = z.infer<typeof CreateCodingAssessmentDtoSchema>;

export const SubmitCodingDtoSchema = z.object({
  assessmentId: z.string().uuid('Invalid assessment ID'),
  studentId: z.string().uuid('Invalid student ID'),
  code: z.string().min(1, 'Code is required'),
  language: z.enum(['javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'go', 'rust']),
});

export type SubmitCodingDto = z.infer<typeof SubmitCodingDtoSchema>;

export interface TestCaseResultDto {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  points: number;
  pointsAwarded: number;
  error?: string;
  executionTime?: number;
}

export interface CodingResultDto {
  attemptId: string;
  assessmentId: string;
  assessmentTitle: string;
  studentId: string;
  studentName: string;
  language: string;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  score: number;
  totalPoints: number;
  pointsAwarded: number;
  percentage: number;
  passed: boolean;
  testCaseResults: TestCaseResultDto[];
  submittedCode: string;
  submittedAt: Date;
  executionTime?: number;
}
