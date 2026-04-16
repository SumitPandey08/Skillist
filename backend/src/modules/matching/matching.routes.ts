import { Router } from 'express';
import * as matchingController from './matching.controller';
import { requireStudent } from '../../core/middlewares/auth';

const router = Router();

router.use(requireStudent);

router.post('/resume/tailor/:jobId', matchingController.tailorResume);
router.post('/roadmap/generate', matchingController.createRoadmap);
router.post('/mock-interview/evaluate', matchingController.evaluateInterview);

export default router;
