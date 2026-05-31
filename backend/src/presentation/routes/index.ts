import { Router } from 'express';
import authRoutes from './auth.routes';
import collegeRoutes from './college.routes';
import courseRoutes from './course.routes';
import enrollmentRoutes from './enrollment.routes';
import attendanceRoutes from './attendance.routes';
import assignmentRoutes from './assignment.routes';
import assessmentRoutes from './assessment.routes';
import projectRoutes from './project.routes';
import certificateRoutes from './certificate.routes';
import subscriptionRoutes from './subscription.routes';
import notificationRoutes from './notification.routes';
import analyticsRoutes from './analytics.routes';
import reportRoutes from './report.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/colleges', collegeRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/projects', projectRoutes);
router.use('/certificates', certificateRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export default router;
