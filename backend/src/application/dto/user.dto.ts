import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.enum(['student', 'trainer', 'admin', 'college_admin']).default('student'),
  collegeId: z.string().uuid().optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
  department: z.string().max(100).optional(),
  semester: z.number().int().min(1).max(12).optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
  department: z.string().max(100).optional(),
  semester: z.number().int().min(1).max(12).optional(),
  avatar: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;
  collegeId?: string;
  collegeName?: string;
  phone?: string;
  department?: string;
  semester?: number;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserFilterDtoSchema = z.object({
  role: z.enum(['student', 'trainer', 'admin', 'college_admin']).optional(),
  collegeId: z.string().uuid().optional(),
  department: z.string().optional(),
  semester: z.coerce.number().int().min(1).max(12).optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type UserFilterDto = z.infer<typeof UserFilterDtoSchema>;
