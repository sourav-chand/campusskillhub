import { Router } from 'express';
import { projectController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, projectController.create);
router.put('/:id', authenticate, projectController.update);
router.post('/:id/milestones', authenticate, projectController.addMilestone);
router.post('/:id/feedback', authenticate, projectController.addFeedback);
router.get('/', authenticate, projectController.list);
router.get('/:id', authenticate, projectController.getById);

export default router;
