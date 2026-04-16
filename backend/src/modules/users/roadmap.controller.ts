import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';
import { generateRoadmap } from '../../lib/ai/roadmap';
import axios from 'axios';

export const createRoadmap = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { targetRole } = req.body;

  try {
    // 1. Get current skills
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: { skills: { include: { skill: true } } }
    });

    const currentSkills = student?.skills.map(s => s.skill.name) || [];

    // 2. Generate Roadmap with AI
    const aiRoadmap = await generateRoadmap(targetRole, currentSkills);

    // 3. Save to DB (Replace existing)
    const roadmap = await prisma.$transaction(async (tx) => {
      await tx.roadmap.deleteMany({ where: { studentId: userId } });

      return await tx.roadmap.create({
        data: {
          id: nanoid(),
          studentId: userId,
          targetRole,
          description: aiRoadmap.description,
          progress: 0,
          steps: {
            create: await Promise.all(aiRoadmap.steps.map(async (step, i) => {
              let skillId: string | null = null;
              if (step.skill_name) {
                const matchedSkill = await tx.skill.findUnique({ where: { name: step.skill_name } });
                skillId = matchedSkill?.id || null;
              }

              return {
                id: nanoid(),
                title: step.title,
                description: step.description,
                notes: step.notes,
                resources: {
                  videos: step.resources.videos,
                  links: step.resources.links,
                  prerequisites: step.prerequisites
                },
                skillId,
                order: i + 1,
                status: 'pending'
              };
            }))
          }
        },
        include: { steps: true }
      });
    });

    // 4. Trigger refinement in background (Internal call or Queue)
    try {
      // Use internal backend URL or just trigger via queue if available
      // For now, we'll assume the queue is available
      const agentQueue = (req.app.get('queues') || {})['agent-queue'];
      if (agentQueue) {
        await agentQueue.add('refine-roadmap', {
          type: 'refine-roadmap',
          payload: { 
            roadmapId: roadmap.id, 
            studentId: userId, 
            targetRole, 
            currentSkills, 
            initialRoadmap: aiRoadmap 
          }
        });
      }
    } catch (err) {
      console.error('Failed to trigger roadmap refinement:', err);
    }

    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

export const updateRoadmapStep = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { stepId } = req.params;
  const { status } = req.body;

  try {
    const step = await prisma.roadmapStep.findUnique({
      where: { id: stepId },
      include: { roadmap: true }
    });

    if (!step || step.roadmap.studentId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.roadmapStep.update({
      where: { id: stepId },
      data: { status, updatedAt: new Date() }
    });

    // Update overall progress
    const allSteps = await prisma.roadmapStep.findMany({
      where: { roadmapId: step.roadmapId }
    });
    const completedSteps = allSteps.filter(s => s.status === 'completed').length;
    const progress = Math.round((completedSteps / allSteps.length) * 100);

    await prisma.roadmap.update({
      where: { id: step.roadmapId },
      data: { progress, updatedAt: new Date() }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteRoadmap = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { id } = req.params;

  try {
    const roadmap = await prisma.roadmap.findUnique({ where: { id } });
    if (!roadmap || roadmap.studentId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.roadmap.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
