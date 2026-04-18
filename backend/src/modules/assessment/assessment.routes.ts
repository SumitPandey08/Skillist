import { Router } from 'express';
import { generateAssessment, submitAssessment, getLatestAssessments } from './assessment.controller';
import { authenticate } from '../../core/middlewares/auth';

const router = Router();

router.post('/generate', authenticate, generateAssessment);
router.post('/submit', authenticate, submitAssessment);
router.get('/latest/:studentId', authenticate, getLatestAssessments);

export default router;
