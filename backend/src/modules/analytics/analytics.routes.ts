import { Router } from 'express';
import { getActivity, getStats, getScores } from './analytics.controller';
import { requireStudent } from '../../core/middlewares/auth';

const router = Router();

router.get('/activity', requireStudent, getActivity);
router.get('/stats', requireStudent, getStats);
router.get('/scores', requireStudent, getScores);

export default router;
