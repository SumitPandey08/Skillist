import { Router } from 'express';
import { getCareerQuestions, recommendCareer, getLatestRecommendation } from './career.controller';
import { authenticate } from '../../core/middlewares/auth';

const router = Router();

router.get('/questions/:studentId', authenticate, getCareerQuestions);
router.post('/recommend', authenticate, recommendCareer);
router.get('/latest/:studentId', authenticate, getLatestRecommendation);

export default router;
