import { z } from 'zod';

export const CreateNotificationDtoSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  message: z.string().min(2, 'Message must be at least 2 characters').max(2000),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  category: z.enum([
    'course', 'assignment', 'assessment', 'attendance',
    'certificate', 'project', 'subscription', 'system',
  ]).default('system'),
  referenceId: z.string().uuid().optional(),
  referenceType: z.string().max(50).optional(),
  actionUrl: z.string().url().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationDtoSchema>;

export interface NotificationResponseDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  referenceId?: string;
  referenceType?: string;
  actionUrl?: string;
  priority: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}
