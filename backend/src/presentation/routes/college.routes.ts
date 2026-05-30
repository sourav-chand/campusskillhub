import { Router } from 'express';
import { collegeController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';
import { validate } from '@presentation/middleware/validate.middleware';
import { CreateCollegeSchema, UpdateCollegeSchema } from '@presentation/validators/college.validator';

const router = Router();

router.post('/', authenticate, authorize('admin'), validate({ body: CreateCollegeSchema }), collegeController.create);
router.put('/:id', authenticate, authorize('admin', 'college_admin'), validate({ body: UpdateCollegeSchema }), collegeController.update);
router.patch('/:id/approve', authenticate, authorize('admin'), collegeController.approve);
router.get('/:id', collegeController.getById);
router.get('/', collegeController.list);
router.get('/:id/stats', authenticate, collegeController.getStats);

export default router;
