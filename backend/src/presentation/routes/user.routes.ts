import { Router } from 'express';
import { userController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.get('/', authenticate, authorize('admin', 'college_admin', 'super_admin'), userController.list);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/change-password', authenticate, userController.changePassword);
router.get('/:id', authenticate, userController.getById);
router.patch('/:id/deactivate', authenticate, authorize('admin', 'college_admin', 'super_admin'), userController.deactivate);

export default router;
