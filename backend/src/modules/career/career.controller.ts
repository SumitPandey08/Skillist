import { Request, Response, NextFunction } from 'express';
import { careerQuestionAgent, careerRecommendationAgent } from '../agentic-ai/career-agent';
import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';

export const getCareerQuestions = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  try {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { skills: { include: { skill: true } } }
    });
    const skills = student?.skills.map(s => s.skill.name) || [];
    
    const result = await careerQuestionAgent.invoke({
      currentSkills: skills,
      messages: []
    });
    res.json(result.refinedRoadmap);
  } catch (error) {
    next(error);
  }
};

export const recommendCareer = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId, behavioralAnswers, assessmentSummary } = req.body;
  try {
    const result = await careerRecommendationAgent.invoke({
      messages: [
        { type: 'assessment', content: JSON.stringify(assessmentSummary) },
        { type: 'behavioral', content: JSON.stringify(behavioralAnswers) }
      ]
    });

    const recommendation = result.refinedRoadmap;

    const saved = await prisma.careerRecommendation.create({
      data: {
        id: nanoid(),
        studentId,
        suggestedRoles: JSON.stringify(recommendation.suggestedRoles),
        gapAnalysis: JSON.stringify(recommendation.gapAnalysis),
        actionPlan: JSON.stringify(recommendation.actionPlan),
        assessmentResultId: assessmentSummary?.id
      }
    });

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

export const getLatestRecommendation = async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;
    try {
        const recommendation = await prisma.careerRecommendation.findFirst({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
            include: { assessmentResult: true }
        });
        res.json(recommendation);
    } catch (error) {
        next(error);
    }
};
