import { Router } from 'express';
import { getActivity, getStats } from './analytics.controller';
import { authenticate } from '../../core/middlewares/auth';

const router = Router();

router.get('/activity', authenticate, getActivity);
router.get('/stats', authenticate, getStats);

export default router;
