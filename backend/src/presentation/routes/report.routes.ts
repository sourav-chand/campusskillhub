import { Router } from 'express';
import { reportController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.get('/attendance', authenticate, authorize('admin', 'college_admin', 'trainer'), reportController.getAttendanceReport);
router.get('/performance', authenticate, reportController.getPerformanceReport);
router.get('/assessment', authenticate, authorize('admin', 'college_admin', 'trainer'), reportController.getAssessmentReport);
router.get('/completion', authenticate, reportController.getCompletionReport);

export default router;
