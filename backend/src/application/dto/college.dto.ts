import { z } from 'zod';

export const CreateCollegeDtoSchema = z.object({
  name: z.string().min(2, 'College name must be at least 2 characters').max(200),
  code: z.string().min(2, 'College code must be at least 2 characters').max(20).optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  country: z.string().min(2).max(100).default('India'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
  email: z.string().email('Invalid email address'),
  website: z.string().url().optional(),
  affiliatedUniversity: z.string().max(200).optional(),
  accreditation: z.string().max(100).optional(),
  adminName: z.string().min(2).max(100),
  adminEmail: z.string().email('Invalid admin email'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export type CreateCollegeDto = z.infer<typeof CreateCollegeDtoSchema>;

export const UpdateCollegeDtoSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  code: z.string().min(2).max(20).optional(),
  address: z.string().min(5).max(500).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url().optional(),
  affiliatedUniversity: z.string().max(200).optional(),
  accreditation: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCollegeDto = z.infer<typeof UpdateCollegeDtoSchema>;

export interface CollegeResponseDto {
  id: string;
  name: string;
  code?: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone?: string;
  email: string;
  website?: string;
  affiliatedUniversity?: string;
  accreditation?: string;
  logo?: string;
  isActive: boolean;
  isApproved: boolean;
  approvedAt?: Date;
  totalStudents?: number;
  totalCourses?: number;
  totalTrainers?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CollegeFilterDtoSchema = z.object({
  search: z.string().max(100).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  isActive: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CollegeFilterDto = z.infer<typeof CollegeFilterDtoSchema>;

export const ApproveCollegeDtoSchema = z.object({
  isApproved: z.literal(true),
  approvedById: z.string().uuid(),
});

export type ApproveCollegeDto = z.infer<typeof ApproveCollegeDtoSchema>;
