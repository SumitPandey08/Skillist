import { Request, Response, NextFunction } from 'express';
import { IntegrationService } from './integrations.service';
import { prisma } from '../../lib/prisma';

export const syncAll = async (req: any, res: Response, next: NextFunction) => {
  const studentId = req.auth.userId;

  try {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (student.githubUsername) {
      await IntegrationService.syncGitHub(studentId, student.githubUsername);
    }
    if (student.leetcodeUsername) {
      await IntegrationService.syncLeetCode(studentId, student.leetcodeUsername);
    }
    if (student.codeforcesUsername) {
      await IntegrationService.syncCodeforces(studentId, student.codeforcesUsername);
    }

    const scores = await IntegrationService.calculateScores(studentId);

    res.json({ success: true, scores });
  } catch (error) {
    next(error);
  }
};

export const getIntelligence = async (req: any, res: Response, next: NextFunction) => {
  const studentId = req.params.studentId || req.auth.userId;

  try {
    const data = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        externalAccounts: {
          include: { githubData: true, leetcodeData: true }
        },
        normalizedSkills: true,
        scores: true
      }
    });

    if (!data) return res.status(404).json({ error: 'Student data not found' });

    res.json(data);
  } catch (error) {
    next(error);
  }
};
