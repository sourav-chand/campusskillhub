import { z } from 'zod';

export const CreateCollegeSchema = z.object({
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
  adminPassword: z.string().min(6).optional(),
});

export const UpdateCollegeSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  code: z.string().min(2).max(20).optional(),
  address: z.string().min(5).max(500).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  affiliatedUniversity: z.string().max(200).optional(),
  accreditation: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});
