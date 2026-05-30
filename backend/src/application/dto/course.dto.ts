import { z } from 'zod';

const ModuleSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  order: z.number().int().min(1),
  content: z.string().optional(),
  duration: z.number().int().positive().optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.enum(['video', 'pdf', 'link', 'document']).default('link'),
  })).optional(),
});

export const CreateCourseDtoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  shortDescription: z.string().max(300).optional(),
  category: z.string().min(2).max(100),
  subcategory: z.string().max(100).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  duration: z.number().int().positive('Duration must be in hours'),
  thumbnail: z.string().url().optional(),
  syllabus: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
  modules: z.array(ModuleSchema).min(1, 'At least one module is required').optional(),
  collegeId: z.string().uuid(),
  trainerId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  price: z.number().min(0).default(0),
});

export type CreateCourseDto = z.infer<typeof CreateCourseDtoSchema>;

export const UpdateCourseDtoSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  shortDescription: z.string().max(300).optional(),
  category: z.string().min(2).max(100).optional(),
  subcategory: z.string().max(100).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  duration: z.number().int().positive().optional(),
  thumbnail: z.string().url().optional(),
  syllabus: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateCourseDto = z.infer<typeof UpdateCourseDtoSchema>;

export interface CourseResponseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  level: string;
  duration: number;
  thumbnail?: string;
  syllabus?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  modules?: Array<{
    id: string;
    title: string;
    description?: string;
    order: number;
    content?: string;
    duration?: number;
    resources?: Array<{
      title: string;
      url: string;
      type: string;
    }>;
  }>;
  collegeId: string;
  collegeName?: string;
  trainerId: string;
  trainerName?: string;
  tags?: string[];
  price: number;
  isPublished: boolean;
  enrollmentCount?: number;
  averageRating?: number;
  totalDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CourseFilterDtoSchema = z.object({
  search: z.string().max(100).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  collegeId: z.string().uuid().optional(),
  trainerId: z.string().uuid().optional(),
  isPublished: z.boolean().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CourseFilterDto = z.infer<typeof CourseFilterDtoSchema>;
