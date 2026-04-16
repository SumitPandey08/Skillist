import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { tailorResumeData } from '../../lib/ai/resume';
import { generateRoadmap } from '../../lib/ai/roadmap';
import { evaluateMockInterview } from '../../lib/ai/interview';

export const tailorResume = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const jobId = req.params.jobId;

  try {
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: { experience: true, projects: true },
    });
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!student || !job) return res.status(404).json({ error: 'Not found' });

    const tailored = await tailorResumeData({
      studentProfile: student,
      experience: student.experience,
      projects: student.projects,
      jobDescription: `${job.title}\n${job.description}`,
    });

    res.json(tailored);
  } catch (error) {
    next(error);
  }
};

export const createRoadmap = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { targetRole } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: { skills: { include: { skill: true } } }
    });
    const currentSkills = student?.skills.map(s => s.skill.name) || [];

    const roadmap = await generateRoadmap(targetRole, currentSkills);
    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

export const evaluateInterview = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { role, question, answer } = req.body;

  try {
    const evaluation = await evaluateMockInterview(userId, role, question, answer);
    res.json({ success: true, evaluation });
  } catch (error) {
    next(error);
  }
};
