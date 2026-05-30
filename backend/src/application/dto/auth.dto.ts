import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const RegisterDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.enum(['student', 'trainer', 'admin', 'college_admin']).default('student'),
  collegeId: z.string().uuid().optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const ForgotPasswordDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDtoSchema>;

export const ResetPasswordDtoSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;

export const VerifyEmailDtoSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailDtoSchema>;

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    collegeId?: string;
  };
  tokens: AuthTokens;
}
