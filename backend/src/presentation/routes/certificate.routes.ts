import { Router } from 'express';
import { certificateController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.post('/generate', authenticate, authorize('admin', 'college_admin'), certificateController.generate);
router.get('/verify/:certificateNumber', certificateController.verify);
router.get('/student/:studentId', authenticate, certificateController.listByStudent);
router.get('/:id/download', authenticate, certificateController.download);

export default router;
