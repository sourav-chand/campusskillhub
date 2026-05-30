import { z } from 'zod';

export const CreateSubscriptionDtoSchema = z.object({
  collegeId: z.string().uuid('Invalid college ID'),
  planId: z.string().uuid('Invalid plan ID'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
  promoCode: z.string().max(50).optional(),
  paymentMethod: z.string().max(50).optional(),
  transactionId: z.string().max(100).optional(),
  amount: z.number().min(0).optional(),
});

export type CreateSubscriptionDto = z.infer<typeof CreateSubscriptionDtoSchema>;

export interface SubscriptionResponseDto {
  id: string;
  collegeId: string;
  collegeName?: string;
  planId: string;
  planName: string;
  planDetails: {
    maxStudents: number;
    maxTrainers: number;
    maxCourses: number;
    features: string[];
  };
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  promoCode?: string;
  amount?: number;
  transactionId?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
