import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { createQueue } from '../../core/queues';
import { nanoid } from 'nanoid';

const resumeQueue = createQueue('resume-parsing');

export const uploadResume = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { fileUrl } = req.body;

  try {
    const resume = await prisma.resume.create({
      data: {
        id: nanoid(),
        studentId: userId,
        fileUrl,
        status: 'pending'
      }
    });

    await resumeQueue.add('parse-resume', {
      resumeId: resume.id,
      userId,
      fileUrl
    });

    res.json({ success: true, resumeId: resume.id });
  } catch (error) {
    next(error);
  }
};

export const getParsingStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const resume = await prisma.resume.findUnique({
      where: { id }
    });
    res.json(resume);
  } catch (error) {
    next(error);
  }
};
