import { Router } from 'express';
import { getActivity, getStats } from './analytics.controller';
import { requireStudent } from '../../core/middlewares/auth';

const router = Router();

router.get('/activity', requireStudent, getActivity);
router.get('/stats', requireStudent, getStats);

export default router;
