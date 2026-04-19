import { Router } from 'express';
import { createQueue } from '../../core/queues';
import logger from '../../core/logger';
import { generateResume } from '../../lib/ai/resume';
import { requireStudent, requireCompany } from '../../core/middlewares/auth';
import { jobAgent } from './job-agent';
import { prisma } from '../../lib/prisma';

const router = Router();
const agentQueue = createQueue('agent-queue');

router.post('/generate-job-description', requireCompany, async (req: any, res) => {
  try {
    const { title, skills, location } = req.body;
    const userId = req.auth.userId;

    if (!title) return res.status(400).json({ error: 'Missing title' });

    // Try to get company info for better generation
    const company = await prisma.company.findUnique({
      where: { id: userId }
    });

    const description = await jobAgent.generateJobDescription({
      title,
      skills: Array.isArray(skills) ? skills : [],
      companyName: company?.companyName,
      industry: company?.industry || undefined,
      location
    });

    res.json({ description });
  } catch (error: any) {
    logger.error(`Failed to generate job description: ${error.message}`);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/refine-roadmap', requireStudent, async (req: any, res) => {
  try {
    const { roadmapId, targetRole, currentSkills, initialRoadmap } = req.body;
    const studentId = req.auth.userId;
    if (!roadmapId) return res.status(400).json({ error: 'Missing roadmapId' });

    await agentQueue.add('refine-roadmap', {
      type: 'refine-roadmap',
      payload: { roadmapId, studentId, targetRole, currentSkills, initialRoadmap }
    });
    res.json({ success: true, message: 'Refinement job queued' });
  } catch (error: any) {
    logger.error(`Failed to queue refinement job: ${error.message}`);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/analyze-interview', requireStudent, async (req: any, res) => {
  try {
    const { interviewId, role, transcript } = req.body;
    const studentId = req.auth.userId;
    if (!interviewId) return res.status(400).json({ error: 'Missing interviewId' });

    await agentQueue.add('analyze-interview', {
      type: 'analyze-interview',
      payload: { interviewId, studentId, role, transcript }
    });
    res.json({ success: true, message: 'Interview analysis job queued' });
  } catch (error: any) {
    logger.error(`Failed to queue interview analysis: ${error.message}`);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/analyze-skills', requireStudent, async (req: any, res) => {
  try {
    const { targetRole, currentSkills } = req.body;
    const studentId = req.auth.userId;
    if (!studentId) return res.status(400).json({ error: 'Missing studentId' });

    await agentQueue.add('analyze-skills', {
      type: 'analyze-skills',
      payload: { studentId, targetRole, currentSkills }
    });
    res.json({ success: true, message: 'Skill analysis job queued' });
  } catch (error: any) {
    logger.error(`Failed to queue skill analysis: ${error.message}`);
    res.status(500).json({ error: error.message || 'Internal server error' });
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
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/resume/generate', requireStudent, async (req, res) => {
  try {
    const { student, targetRole, modelProvider, industry } = req.body;
    if (!student) return res.status(400).json({ error: 'Missing student data' });
    if (!targetRole) return res.status(400).json({ error: 'Missing targetRole' });

    logger.info(`Generating resume for target role: ${targetRole}, model: ${modelProvider || 'default'}`);
    
    const resume = await generateResume({ 
      student, 
      targetRole, 
      modelProvider: modelProvider || 'gemini-flash',
      industry: industry || 'technology'
    });
    
    res.json({ 
      resume,
      atsScore: resume.atsScore,
      suggestions: resume.suggestions,
    });
  } catch (error: any) {
    logger.error(`Failed to generate resume: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

export default router;
