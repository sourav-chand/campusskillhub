import { Router } from 'express';
import { enrollmentController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, enrollmentController.create);
router.get('/student/:studentId', authenticate, enrollmentController.listByStudent);
router.get('/course/:courseId', authenticate, enrollmentController.listByCourse);
router.patch('/:id/progress', authenticate, enrollmentController.updateProgress);

export default router;
