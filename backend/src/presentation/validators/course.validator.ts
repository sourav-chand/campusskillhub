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

export const CreateCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  shortDescription: z.string().max(300).optional(),
  category: z.string().min(2).max(100).transform(val => val.toUpperCase()),
  subcategory: z.string().max(100).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  duration: z.number().int().positive('Duration must be in hours'),
  thumbnail: z.string().url().optional(),
  syllabus: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
  modules: z.array(ModuleSchema).min(1).optional(),
  collegeId: z.string().uuid().optional(),
  trainerId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().min(0).default(0),
});

export const UpdateCourseSchema = z.object({
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
