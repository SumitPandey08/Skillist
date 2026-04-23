import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';

export const getActivity = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const activity = await AnalyticsService.getUserActivity(userId);
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const stats = await AnalyticsService.getDashboardStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getScores = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { prisma } = require('../../lib/prisma');
  try {
    const scores = await prisma.userScore.findUnique({
      where: { studentId: userId }
    });
    
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: {
        skills: { include: { skill: true } }
      }
    });

    res.json({
      scores,
      student,
      skills: student?.skills.map((s: any) => ({
        name: s.skill.name,
        proficiency: s.proficiency
      })) || []
    });
  } catch (error) {
    next(error);
  }
};
