import { Router } from 'express';
import { authController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authLimiter } from '@presentation/middleware/rate-limit.middleware';
import { validate } from '@presentation/middleware/validate.middleware';
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema, RefreshTokenSchema } from '@presentation/validators/auth.validator';

const router = Router();

router.post('/register', authLimiter, validate({ body: RegisterSchema }), authController.register);
router.post('/login', authLimiter, validate({ body: LoginSchema }), authController.login);
router.post('/forgot-password', authLimiter, validate({ body: ForgotPasswordSchema }), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate({ body: ResetPasswordSchema }), authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/refresh-token', validate({ body: RefreshTokenSchema }), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
