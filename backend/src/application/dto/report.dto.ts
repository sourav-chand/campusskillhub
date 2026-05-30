import { z } from 'zod';

export const ReportFilterDtoSchema = z.object({
  collegeId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  trainerId: z.string().uuid().optional(),
  fromDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid from date'),
  toDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid to date'),
  groupBy: z.enum(['day', 'week', 'month', 'year']).default('month'),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
});

export type ReportFilterDto = z.infer<typeof ReportFilterDtoSchema>;

export interface AttendanceReportDto {
  collegeId?: string;
  collegeName?: string;
  courseId?: string;
  courseTitle?: string;
  totalStudents: number;
  totalSessions: number;
  overallPercentage: number;
  monthlyBreakdown: Array<{
    month: string;
    year: number;
    totalSessions: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    percentage: number;
  }>;
  studentWise: Array<{
    studentId: string;
    studentName: string;
    totalSessions: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    percentage: number;
  }>;
  generatedAt: Date;
}

export interface PerformanceReportDto {
  studentId?: string;
  studentName?: string;
  courseId?: string;
  courseTitle?: string;
  collegeId?: string;
  collegeName?: string;
  overallScore: number;
  assessmentAverage: number;
  assignmentAverage: number;
  projectScore?: number;
  attendancePercentage: number;
  courseCompletion: number;
  grade?: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  generatedAt: Date;
}

export interface AssessmentReportDto {
  assessmentId?: string;
  assessmentTitle?: string;
  assessmentType: 'mcq' | 'coding';
  courseId?: string;
  courseTitle?: string;
  collegeId?: string;
  totalStudents: number;
  attemptedStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  scoreDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  questionWise: Array<{
    questionId: string;
    questionText: string;
    correctCount: number;
    incorrectCount: number;
    difficulty: number;
  }>;
  generatedAt: Date;
}
