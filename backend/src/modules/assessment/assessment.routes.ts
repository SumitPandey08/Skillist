import { Router } from 'express';
import { generateAssessment, submitAssessment, getLatestAssessments } from './assessment.controller';
import { requireStudent } from '../../core/middlewares/auth';

const router = Router();

router.post('/generate', requireStudent, generateAssessment);
router.post('/submit', requireStudent, submitAssessment);
router.get('/latest/:studentId', requireStudent, getLatestAssessments);

export default router;
