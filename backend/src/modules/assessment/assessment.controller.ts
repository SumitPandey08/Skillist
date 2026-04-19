import { Request, Response, NextFunction } from 'express';
import { assessmentAgent } from '../agentic-ai/assessment-agent';
import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';
import { AnalyticsService } from '../analytics/analytics.service';

export const generateAssessment = async (req: Request, res: Response, next: NextFunction) => {
  const { skillName } = req.body;
  try {
    const result = await assessmentAgent.invoke({
      currentSkills: [skillName],
      messages: []
    });
    res.json(result.refinedRoadmap);
  } catch (error) {
    next(error);
  }
};

export const submitAssessment = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId, skillName, score, totalQuestions, correctAnswers, identifiedGaps } = req.body;
  try {
    const result = await prisma.assessmentResult.create({
      data: {
        id: nanoid(),
        studentId,
        skillName,
        score,
        totalQuestions,
        correctAnswers,
        identifiedGaps: JSON.stringify(identifiedGaps)
      }
    });

    await AnalyticsService.trackEvent(studentId, 'skill_test_completed', { skillName, score });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getLatestAssessments = async (req: Request, res: Response, next: NextFunction) => {
    const rawStudentId = req.params.studentId;
    const studentId = Array.isArray(rawStudentId) ? rawStudentId[0] : rawStudentId;

    if (!studentId) {
        return res.status(400).json({ error: 'studentId is required' });
    }

    try {
        const results = await prisma.assessmentResult.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        res.json(results);
    } catch (error) {
        next(error);
    }
};
