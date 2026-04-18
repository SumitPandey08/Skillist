import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';
import jobRoutes from './jobs/job.routes';
import matchingRoutes from './matching/matching.routes';
import skillsRoutes from './skills/skills.routes';
import resumeRoutes from './resume/resume.routes';
import integrationsRoutes from './integrations/integrations.routes';
import agenticRoutes from './agentic-ai/agent.routes';
import assessmentRoutes from './assessment/assessment.routes';
import careerRoutes from './career/career.routes';
import analyticsRoutes from './analytics/analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/matching', matchingRoutes);
router.use('/skills', skillsRoutes);
router.use('/resume', resumeRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/agentic', agenticRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/career', careerRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
