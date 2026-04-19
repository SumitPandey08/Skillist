import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';
import { getNextInterviewQuestion, analyzeInterviewPerformance, ChatMessage } from '../../lib/ai/interview';

export const createInterview = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { role } = req.body;

  try {
    const interview = await prisma.mockInterview.create({
      data: {
        id: nanoid(),
        studentId: userId,
        role,
        status: 'scheduled',
        updatedAt: new Date()
      }
    });

    res.json({ success: true, id: interview.id });
  } catch (error) {
    next(error);
  }
};

export const getMockInterviewById = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { interviewId } = req.params;

  try {
    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: { 
        messages: { orderBy: { createdAt: 'asc' } } 
      }
    });

    if (!interview || interview.studentId !== userId) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    next(error);
  }
};

export const addInterviewMessage = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { interviewId } = req.params;
  const { role, content } = req.body; // role: 'candidate' or 'interviewer'

  try {
    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!interview || interview.studentId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const msgId = nanoid();
    await prisma.interviewMessage.create({
      data: {
        id: msgId,
        interviewId,
        role,
        content
      }
    });

    if (role === 'interviewer') {
      return res.json({ success: true, id: msgId });
    }

    // Trigger AI Turn
    const history: ChatMessage[] = (interview.messages || []).map(m => ({
      role: m.role === 'interviewer' ? 'assistant' : 'user',
      content: m.content
    }));
    history.push({ role: 'user', content });

    try {
      const aiQuestion = await getNextInterviewQuestion(interview.role, history);
      const aiMsgId = nanoid();
      
      await prisma.interviewMessage.create({
        data: {
          id: aiMsgId,
          interviewId,
          role: 'interviewer',
          content: aiQuestion
        }
      });

      await prisma.mockInterview.update({
        where: { id: interviewId },
        data: { status: 'in_progress', updatedAt: new Date() }
      });

      res.json({ success: true, id: aiMsgId, content: aiQuestion });
    } catch (aiError) {
      console.error('AI Interview Error:', aiError);
      // Fallback
      const fallback = "Could you tell me more about your experience with complex systems?";
      const aiMsgId = nanoid();
      await prisma.interviewMessage.create({
        data: { id: aiMsgId, interviewId, role: 'interviewer', content: fallback }
      });
      res.json({ success: true, id: aiMsgId, content: fallback });
    }
  } catch (error) {
    next(error);
  }
};

export const completeInterview = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { interviewId } = req.params;

  try {
    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!interview || interview.studentId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // 1. Mark as completed
    await prisma.mockInterview.update({
      where: { id: interviewId },
      data: { status: 'completed', updatedAt: new Date() }
    });

    // 2. Perform AI Analysis
    const history: ChatMessage[] = (interview.messages || []).map(m => ({
      role: m.role === 'interviewer' ? 'assistant' : 'user',
      content: m.content
    }));

    const evaluation = await analyzeInterviewPerformance(interview.role, history);

    // 3. Save Evaluation
    await prisma.mockInterview.update({
      where: { id: interviewId },
      data: { 
        score: evaluation.score,
        feedback: JSON.stringify(evaluation),
        updatedAt: new Date() 
      }
    });

    res.json({ success: true, evaluation });
  } catch (error) {
    next(error);
  }
};

export const scheduleInterview = async (req: any, res: Response, next: NextFunction) => {
  const companyId = req.auth.userId;
  const { studentId, jobId, role, scheduledAt } = req.body;

  try {
    const interview = await prisma.mockInterview.create({
      data: {
        id: nanoid(),
        studentId,
        companyId,
        jobId,
        role,
        scheduledAt: new Date(scheduledAt),
        status: 'scheduled',
        updatedAt: new Date()
      }
    });

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

export const getCompanyInterviews = async (req: any, res: Response, next: NextFunction) => {
  const companyId = req.auth.userId;
  const { jobId } = req.query;

  try {
    const interviews = await prisma.mockInterview.findMany({
      where: { 
        companyId,
        jobId: jobId ? (jobId as string) : undefined
      },
      include: {
        student: true,
        job: true
      },
      orderBy: { scheduledAt: 'asc' }
    });

    res.json(interviews);
  } catch (error) {
    next(error);
  }
};
