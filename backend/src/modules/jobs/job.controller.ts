import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { calculateMatchScore } from '../../lib/ai/matcher';
import { generateEmbedding } from '../../lib/ai/embeddings';
import { nanoid } from 'nanoid';

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'active' },
      include: { company: true },
    });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobs = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  try {
    const jobs = await prisma.job.findMany({
      where: { companyId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: { id: id as string },
      include: {
        company: true,
        skills: { include: { skill: true } }
      }
    });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobDetails = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        skills: { include: { skill: true } }
      }
    });
    if (!job || job.companyId !== userId) {
      return res.status(403).json({ error: 'Forbidden or not found' });
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const { title, description, location, salaryRange, jobType, status, skills } = req.body;

  try {
    const jobId = nanoid();
    const jobVector = await generateEmbedding(`${title}\n${description}`);

    // Create job using transaction to handle skills and vector
    const job = await prisma.$transaction(async (tx) => {
      // Prisma doesn't support vector type directly in create, use raw for the vector part if needed
      // or update it after creation. Standard prisma create for the rest.
      const createdJob = await tx.job.create({
        data: {
          id: jobId,
          companyId: userId,
          title,
          description,
          location,
          salaryRange,
          jobType,
          status: status || 'active',
        }
      });

      // Update vector using raw query
      await tx.$executeRawUnsafe(
        `UPDATE jobs SET job_vector = cast($1 as vector) WHERE id = $2`,
        `[${jobVector.join(',')}]`,
        jobId
      );

      // Add skills
      if (skills && Array.isArray(skills)) {
        for (const skillItem of skills) {
          const skillText = typeof skillItem === 'string' ? skillItem : skillItem.text;
          const skill = await tx.skill.upsert({
            where: { name: skillText },
            update: {},
            create: { id: nanoid(), name: skillText }
          });

          await tx.jobSkill.create({
            data: {
              jobId,
              skillId: skill.id,
              requiredProficiency: 'intermediate'
            }
          });
        }
      }

      return createdJob;
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const { id } = req.params;
  const { title, description, location, salaryRange, jobType, status, skills } = req.body;

  try {
    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob || existingJob.companyId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const jobVector = await generateEmbedding(`${title}\n${description}`);

    await prisma.$transaction(async (tx) => {
      await tx.job.update({
        where: { id },
        data: {
          title,
          description,
          location,
          salaryRange,
          jobType,
          status,
          updatedAt: new Date(),
        }
      });

      await tx.$executeRawUnsafe(
        `UPDATE jobs SET job_vector = cast($1 as vector) WHERE id = $2`,
        `[${jobVector.join(',')}]`,
        id
      );

      // Sync skills
      await tx.jobSkill.deleteMany({ where: { jobId: id } });
      if (skills && Array.isArray(skills)) {
        for (const skillItem of skills) {
          const skillText = typeof skillItem === 'string' ? skillItem : skillItem.text;
          const skill = await tx.skill.upsert({
            where: { name: skillText },
            update: {},
            create: { id: nanoid(), name: skillText }
          });

          await tx.jobSkill.create({
            data: {
              jobId: id,
              skillId: skill.id,
              requiredProficiency: 'intermediate'
            }
          });
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const { id } = req.params;
  const { status } = req.body;

  try {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.companyId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.job.update({
      where: { id },
      data: { status, updatedAt: new Date() }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const { id } = req.params;

  try {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.companyId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.job.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const applyToJob = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const jobId = req.params.id;

  try {
    const existing = await prisma.application.findFirst({
      where: { studentId: userId, jobId },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied' });
    }

    const scores = await calculateMatchScore(userId, jobId);

    const application = await prisma.application.create({
      data: {
        id: nanoid(),
        studentId: userId,
        jobId,
        matchScore: scores.totalScore,
        skillScore: scores.skillScore,
        expScore: scores.expScore,
        projScore: scores.projScore,
        potentialScore: scores.potentialScore,
        analysis: scores.analysis,
        status: 'pending',
      },
    });

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const { status } = req.body;
  const { jobId, appId } = req.params;

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (job?.companyId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const application = await prisma.application.update({
      where: { id: appId },
      data: { status }
    });

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth?.userId;
  const { appId } = req.params;
  try {
    const application = await prisma.application.findUnique({
      where: { id: appId },
      include: {
        job: true,
        student: {
          include: {
            user: true
          }
        }
      }
    });

    if (!application || application.job.companyId !== userId) {
      return res.status(403).json({ error: 'Forbidden or not found' });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};
