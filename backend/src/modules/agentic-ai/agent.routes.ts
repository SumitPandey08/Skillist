import { Router } from 'express';
import { createQueue } from '../../core/queues';
import logger from '../../core/logger';
import { generateResume } from '../../lib/ai/resume';
import { requireStudent } from '../../core/middlewares/auth';

const router = Router();
const agentQueue = createQueue('agent-queue');

router.post('/refine-roadmap', async (req, res) => {
  try {
    const { roadmapId, studentId, targetRole, currentSkills, initialRoadmap } = req.body;
    if (!roadmapId) return res.status(400).json({ error: 'Missing roadmapId' });

    await agentQueue.add('refine-roadmap', {
      type: 'refine-roadmap',
      payload: { roadmapId, studentId, targetRole, currentSkills, initialRoadmap }
    });
    res.json({ success: true, message: 'Refinement job queued' });
  } catch (error: any) {
    logger.error(`Failed to queue refinement job: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/analyze-interview', async (req, res) => {
  try {
    const { interviewId, studentId, role, transcript } = req.body;
    if (!interviewId) return res.status(400).json({ error: 'Missing interviewId' });

    await agentQueue.add('analyze-interview', {
      type: 'analyze-interview',
      payload: { interviewId, studentId, role, transcript }
    });
    res.json({ success: true, message: 'Interview analysis job queued' });
  } catch (error: any) {
    logger.error(`Failed to queue interview analysis: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/analyze-skills', async (req, res) => {
  try {
    const { studentId, targetRole, currentSkills } = req.body;
    if (!studentId) return res.status(400).json({ error: 'Missing studentId' });

    await agentQueue.add('analyze-skills', {
      type: 'analyze-skills',
      payload: { studentId, targetRole, currentSkills }
    });
    res.json({ success: true, message: 'Skill analysis job queued' });
  } catch (error: any) {
    logger.error(`Failed to queue skill analysis: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/generate-resume', async (req, res) => {
  try {
    const { student, targetRole } = req.body;
    if (!student) return res.status(400).json({ error: 'Missing student data' });

    await agentQueue.add('generate-resume', {
      type: 'generate-resume',
      payload: { student, targetRole }
    });
    res.json({ success: true, message: 'Resume generation job queued' });
  } catch (error: any) {
    logger.error(`Failed to queue resume generation: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/resume/generate', requireStudent, async (req, res) => {
  try {
    const { student, targetRole } = req.body;
    if (!student) return res.status(400).json({ error: 'Missing student data' });
    if (!targetRole) return res.status(400).json({ error: 'Missing targetRole' });

    logger.info(`Generating resume for target role: ${targetRole}`);
    const resume = await generateResume({ student, targetRole });
    res.json({ resume });
  } catch (error: any) {
    logger.error(`Failed to generate resume: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

export default router;
