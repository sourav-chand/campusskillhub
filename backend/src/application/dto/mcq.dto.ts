import { z } from 'zod';

const QuestionOptionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean().default(false),
});

const QuestionSchema = z.object({
  questionText: z.string().min(3, 'Question text must be at least 3 characters'),
  questionType: z.enum(['single', 'multiple']).default('single'),
  options: z.array(QuestionOptionSchema).min(2, 'At least 2 options required'),
  points: z.number().int().positive().default(1),
  explanation: z.string().max(2000).optional(),
});

export const CreateMCQTestDtoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10).max(5000),
  courseId: z.string().uuid('Invalid course ID'),
  createdById: z.string().uuid('Invalid creator ID'),
  duration: z.number().int().positive('Duration in minutes').default(30),
  passingScore: z.number().int().positive().default(40),
  maxAttempts: z.number().int().positive().default(1),
  shuffleQuestions: z.boolean().default(false),
  showResult: z.boolean().default(true),
  questions: z.array(QuestionSchema).min(1, 'At least one question is required'),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid deadline').optional(),
});

export type CreateMCQTestDto = z.infer<typeof CreateMCQTestDtoSchema>;

const AnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedOptions: z.array(z.number().int().min(0)),
});

export const SubmitMCQAttemptDtoSchema = z.object({
  testId: z.string().uuid('Invalid test ID'),
  studentId: z.string().uuid('Invalid student ID'),
  answers: z.array(AnswerSchema).min(1, 'At least one answer is required'),
  timeSpent: z.number().int().positive().optional(),
});

export type SubmitMCQAttemptDto = z.infer<typeof SubmitMCQAttemptDtoSchema>;

export interface QuestionResultDto {
  questionId: string;
  questionText: string;
  selectedOptions: number[];
  correctOptions: number[];
  isCorrect: boolean;
  points: number;
  pointsAwarded: number;
  explanation?: string;
}

export interface MCQResultDto {
  attemptId: string;
  testId: string;
  testTitle: string;
  studentId: string;
  studentName: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  totalPoints: number;
  pointsAwarded: number;
  percentage: number;
  passed: boolean;
  timeSpent?: number;
  questions: QuestionResultDto[];
  submittedAt: Date;
}
