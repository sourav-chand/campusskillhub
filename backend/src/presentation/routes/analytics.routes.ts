import { Router } from 'express';
import { analyticsController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.get('/dashboard', authenticate, analyticsController.getDashboardStats);
router.get('/student-growth', authenticate, analyticsController.getStudentGrowth);
router.get('/enrollment-trend', authenticate, analyticsController.getEnrollmentTrend);
router.get('/student-distribution', authenticate, analyticsController.getStudentDistribution);
router.get('/course-completion', authenticate, analyticsController.getCourseCompletion);
router.get('/top-courses', authenticate, analyticsController.getTopCourses);
router.get('/attendance', authenticate, analyticsController.getAttendanceAnalytics);
router.get('/performance', authenticate, analyticsController.getPerformanceMetrics);
router.get('/courses/:courseId', authenticate, analyticsController.getCourseAnalytics);
router.get('/colleges/:collegeId', authenticate, authorize('admin', 'college_admin', 'super_admin'), analyticsController.getCollegeAnalytics);
router.get('/revenue', authenticate, authorize('admin', 'super_admin'), analyticsController.getRevenueAnalytics);

export default router;
