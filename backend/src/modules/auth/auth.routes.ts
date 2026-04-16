import { Router } from 'express';
import * as authController from './auth.controller';
import * as webhooksController from './webhooks.controller';
import { requireAuth } from '../../core/middlewares/auth';

const router = Router();

router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/onboarding', requireAuth, authController.onboarding);
router.post('/webhooks/clerk', webhooksController.clerkWebhook);

export default router;
