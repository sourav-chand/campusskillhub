import { Router } from 'express';
import { notificationController } from '@presentation/controllers/controllerFactory';
import { authenticate } from '@presentation/middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, notificationController.list);
router.patch('/read-all', authenticate, notificationController.markAllRead);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.patch('/:id/read', authenticate, notificationController.markAsRead);

export default router;
