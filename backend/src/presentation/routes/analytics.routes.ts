import { Router } from 'express';
import { analyticsController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.get('/dashboard', authenticate, analyticsController.getDashboardStats);
router.get('/student-growth', authenticate, analyticsController.getStudentGrowth);
router.get('/courses/:courseId', authenticate, analyticsController.getCourseAnalytics);
router.get('/colleges/:collegeId', authenticate, authorize('admin', 'college_admin'), analyticsController.getCollegeAnalytics);
router.get('/revenue', authenticate, authorize('admin'), analyticsController.getRevenueAnalytics);

export default router;
