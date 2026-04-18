import { Router } from 'express';
import { getCareerQuestions, recommendCareer, getLatestRecommendation } from './career.controller';
import { requireStudent } from '../../core/middlewares/auth';

const router = Router();

router.get('/questions/:studentId', requireStudent, getCareerQuestions);
router.post('/recommend', requireStudent, recommendCareer);
router.get('/latest/:studentId', requireStudent, getLatestRecommendation);

export default router;
