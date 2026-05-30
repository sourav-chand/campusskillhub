import { Router } from 'express';
import { attendanceController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, authorize('admin', 'college_admin', 'trainer'), attendanceController.mark);
router.get('/student/:studentId', authenticate, attendanceController.getByStudent);
router.get('/class/:courseId', authenticate, attendanceController.getByClass);
router.get('/report/monthly', authenticate, attendanceController.getMonthlyReport);
router.get('/today/:courseId', authenticate, attendanceController.getToday);

export default router;
