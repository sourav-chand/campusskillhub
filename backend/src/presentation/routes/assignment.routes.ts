import { Router } from 'express';
import { assignmentController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, authorize('admin', 'college_admin', 'trainer'), assignmentController.create);
router.post('/submit', authenticate, assignmentController.submit);
router.post('/grade', authenticate, authorize('admin', 'college_admin', 'trainer'), assignmentController.grade);
router.get('/course/:courseId', authenticate, assignmentController.listByCourse);
router.get('/student/:studentId', authenticate, assignmentController.listByStudent);
router.get('/:id', authenticate, assignmentController.getById);

export default router;
