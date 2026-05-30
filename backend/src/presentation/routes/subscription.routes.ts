import { Router } from 'express';
import { subscriptionController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, authorize('admin'), subscriptionController.create);
router.get('/', authenticate, subscriptionController.list);
router.get('/current/:collegeId', authenticate, subscriptionController.getCurrent);
router.patch('/:id/cancel', authenticate, authorize('admin'), subscriptionController.cancel);


export default router;
