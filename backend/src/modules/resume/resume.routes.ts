import { Router } from 'express';
import * as resumeController from './resume.controller';
import { requireStudent } from '../../core/middlewares/auth';

const router = Router();

router.use(requireStudent);

router.post('/upload', resumeController.uploadResume);
router.get('/:id/status', resumeController.getParsingStatus);

export default router;
