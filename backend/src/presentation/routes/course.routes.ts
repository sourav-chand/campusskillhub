import { Router } from 'express';
import { courseController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';
import { validate } from '@presentation/middleware/validate.middleware';
import { CreateCourseSchema, UpdateCourseSchema } from '@presentation/validators/course.validator';

const router = Router();

router.get('/categories/list', courseController.getCategories);
router.post('/', authenticate, authorize('super_admin', 'college_admin', 'trainer'), validate({ body: CreateCourseSchema }), courseController.create);
router.get('/', courseController.list);
router.get('/:id', courseController.getById);
router.put('/:id', authenticate, authorize('super_admin', 'college_admin', 'trainer'), validate({ body: UpdateCourseSchema }), courseController.update);
router.patch('/:id/publish', authenticate, authorize('super_admin', 'college_admin'), courseController.publish);

// Module routes
router.get('/:id/modules', authenticate, courseController.getModules);
router.post('/:id/modules', authenticate, authorize('super_admin', 'college_admin', 'trainer'), courseController.addModule);
router.put('/:id/modules/:moduleId', authenticate, authorize('super_admin', 'college_admin', 'trainer'), courseController.updateModule);
router.delete('/:id/modules/:moduleId', authenticate, authorize('super_admin', 'college_admin', 'trainer'), courseController.deleteModule);

// Lesson routes
router.post('/:id/modules/:moduleId/lessons', authenticate, authorize('super_admin', 'college_admin', 'trainer'), courseController.addLesson);
router.put('/:id/modules/:moduleId/lessons/:lessonId', authenticate, authorize('super_admin', 'college_admin', 'trainer'), courseController.updateLesson);
router.delete('/:id/modules/:moduleId/lessons/:lessonId', authenticate, authorize('super_admin', 'college_admin', 'trainer'), courseController.deleteLesson);

export default router;
