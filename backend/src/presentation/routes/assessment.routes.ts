import { Router } from 'express';
import { assessmentController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.post('/mcq', authenticate, authorize('admin', 'college_admin', 'trainer'), assessmentController.createMCQ);
router.post('/mcq/submit', authenticate, assessmentController.submitMCQ);
router.get('/mcq/:testId/results', authenticate, assessmentController.getMCQResults);
router.get('/mcq/:testId/leaderboard', authenticate, assessmentController.getLeaderboard);

router.post('/coding', authenticate, authorize('admin', 'college_admin', 'trainer'), assessmentController.createCoding);
router.post('/coding/submit', authenticate, assessmentController.submitCoding);
router.get('/coding/:assessmentId/results', authenticate, assessmentController.getCodingResults);

export default router;
