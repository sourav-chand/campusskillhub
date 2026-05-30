import { z } from 'zod';

export const MarkAttendanceDtoSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  courseId: z.string().uuid('Invalid course ID'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  markedById: z.string().uuid('Invalid marker ID'),
  remarks: z.string().max(500).optional(),
});

export type MarkAttendanceDto = z.infer<typeof MarkAttendanceDtoSchema>;

export const AttendanceFilterDtoSchema = z.object({
  studentId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  collegeId: z.string().uuid().optional(),
  status: z.enum(['present', 'absent', 'late', 'excused']).optional(),
  fromDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid from date').optional(),
  toDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid to date').optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2020).max(2100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type AttendanceFilterDto = z.infer<typeof AttendanceFilterDtoSchema>;

export interface AttendanceResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  date: Date;
  status: string;
  markedById: string;
  markedByName?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}
