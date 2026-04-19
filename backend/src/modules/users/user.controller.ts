import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { nanoid } from 'nanoid';

// --- Student Controllers ---

export const getPortfolioBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { slug: slug as string },
      include: {
        skills: { include: { skill: true } },
        projects: { orderBy: { startDate: 'desc' } },
        certifications: { orderBy: { issueDate: 'desc' } },
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json({ student });
  } catch (error) {
    next(error);
  }
};

export const getStudentDashboard = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  
  try {
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: {
        skills: { include: { skill: true } },
        projects: { orderBy: { startDate: 'desc' } },
        certifications: { orderBy: { issueDate: 'desc' } },
        applications: {
          include: { job: { include: { company: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        roadmaps: {
          include: { steps: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        mockInterviews: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    });

    res.json({ student });
  } catch (error) {
    next(error);
  }
};

export const getStudentFullProfile = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: {
        user: true,
        skills: { include: { skill: true } },
        projects: true,
        experience: true,
        education: true,
        certifications: true
      }
    });
    res.json({ student });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: any, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        skills: { include: { skill: true } },
        projects: true,
        experience: true,
        education: true,
        certifications: true
      }
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ student });
  } catch (error) {
    next(error);
  }
};

export const addSkill = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { name, category, proficiency } = req.body;

  try {
    const skill = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { id: nanoid(), name, category }
    });

    await prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId: userId,
          skillId: skill.id
        }
      },
      update: { proficiency, updatedAt: new Date() },
      create: {
        studentId: userId,
        skillId: skill.id,
        proficiency
      }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const removeSkill = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { skillId } = req.params;

  try {
    await prisma.studentSkill.delete({
      where: {
        studentId_skillId: {
          studentId: userId,
          skillId
        }
      }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const addProject = async (req: any, res: Response, next: NextFunction) => {
  const { title, description, url, imageUrl, startDate, endDate } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        id: nanoid(),
        studentId: req.auth.userId,
        title,
        description,
        url,
        imageUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: { id, studentId: userId }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const addCertification = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { name, issuer, issueDate, credentialUrl } = req.body;

  try {
    await prisma.certification.create({
      data: {
        id: nanoid(),
        studentId: userId,
        name,
        issuer,
        issueDate: issueDate ? new Date(issueDate) : null,
        credentialUrl
      }
    });
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { id } = req.params;

  try {
    await prisma.certification.delete({
      where: { id, studentId: userId }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateBio = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { bio } = req.body;

  try {
    await prisma.student.update({
      where: { id: userId },
      data: { bio, updatedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updatePlatformConnections = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { githubUrl, leetcodeUrl, codeforcesUrl, linkedinUrl } = req.body;

  const extractUsername = (url: string | undefined) => {
    if (!url) return null;
    const cleanUrl = url.trim().replace(/\/$/, "");
    return cleanUrl.split("/").pop() || null;
  };

  try {
    await prisma.student.update({
      where: { id: userId },
      data: {
        githubUrl,
        leetcodeUrl,
        codeforcesUrl,
        linkedinUrl,
        githubUsername: extractUsername(githubUrl),
        leetcodeUsername: extractUsername(leetcodeUrl),
        codeforcesUsername: extractUsername(codeforcesUrl),
        updatedAt: new Date(),
      }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatusByAppId = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { appId } = req.params;
  const { status } = req.body;

  try {
    const application = await prisma.application.findUnique({
      where: { id: appId },
      include: { job: true }
    });

    if (!application || application.job.companyId !== userId) {
      return res.status(403).json({ error: 'Forbidden or not found' });
    }

    await prisma.application.update({
      where: { id: appId },
      data: { status, updatedAt: new Date() }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getRoadmaps = async (req: any, res: Response, next: NextFunction) => {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { studentId: req.auth.userId },
      include: { steps: { orderBy: { order: 'asc' } } }
    });
    res.json(roadmaps);
  } catch (error) {
    next(error);
  }
};

export const getMockInterviews = async (req: any, res: Response, next: NextFunction) => {
  try {
    const interviews = await prisma.mockInterview.findMany({
      where: { studentId: req.auth.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

// --- Company Controllers ---

export const getCompanyDashboard = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const company = await prisma.company.findUnique({
      where: { id: userId },
      include: {
        jobs: {
          include: {
            applications: {
              include: {
                student: true
              }
            }
          }
        }
      }
    });

    if (!company) return res.status(404).json({ error: 'Company not found' });

    const totalJobs = company.jobs.length;
    const activeJobs = company.jobs.filter(j => j.status === 'active').length;
    let totalApplications = 0;
    let highMatchCandidates = 0;
    const allApplications: any[] = [];
    
    company.jobs.forEach(job => {
      totalApplications += job.applications.length;
      job.applications.forEach(app => {
        if (app.matchScore >= 80) highMatchCandidates++;
        allApplications.push({
          id: app.id,
          jobId: job.id,
          studentName: app.student.name,
          jobTitle: job.title,
          matchScore: app.matchScore,
        });
      });
    });

    const topTalent = allApplications
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    res.json({
      company,
      analytics: {
        totalJobs,
        activeJobs,
        totalApplications,
        highMatchCandidates,
      },
      topTalent
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyCandidates = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { jobId } = req.query;

  try {
    const company = await prisma.company.findUnique({
      where: { id: userId },
      include: {
        jobs: {
          where: jobId ? { id: jobId as string } : undefined,
          include: {
            applications: {
              include: {
                student: true
              },
              orderBy: { matchScore: 'desc' }
            }
          }
        }
      }
    });

    if (!company) return res.status(404).json({ error: 'Company not found' });

    const allApplications: any[] = [];
    company.jobs.forEach(job => {
      job.applications.forEach(app => {
        allApplications.push({
          id: app.id,
          jobId: job.id,
          studentName: app.student.name,
          jobTitle: job.title,
          matchScore: app.matchScore,
          status: app.status,
          appliedAt: app.createdAt,
        });
      });
    });

    res.json(allApplications);
  } catch (error) {
    next(error);
  }
};

export const getCompanyProfile = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const company = await prisma.company.findUnique({
      where: { id: userId },
      include: {
        user: true
      }
    });
    res.json({ company });
  } catch (error) {
    next(error);
  }
};

export const searchCandidates = async (req: Request, res: Response, next: NextFunction) => {
  const { skill } = req.query;
  
  try {
    let whereClause = {};
    if (skill) {
      whereClause = {
        skills: {
          some: {
            skill: { name: { contains: String(skill), mode: 'insensitive' } }
          }
        }
      };
    }

    const candidates = await prisma.student.findMany({
      where: whereClause,
      include: {
        skills: { include: { skill: true } },
        experience: true
      },
      take: 20
    });

    res.json(candidates);
  } catch (error) {
    next(error);
  }
};

// --- Resume Controllers ---

export const getResumes = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  
  try {
    const resumes = await prisma.resumeVersion.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ resumes });
  } catch (error) {
    next(error);
  }
};

export const saveResume = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { jobTitle, content } = req.body;
  
  try {
    const resume = await prisma.resumeVersion.create({
      data: {
        id: nanoid(),
        studentId: userId,
        jobTitle: jobTitle || 'General',
        content: JSON.stringify(content)
      }
    });
    res.json({ resume });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { id } = req.params;
  const { jobTitle, content } = req.body;
  
  try {
    const existing = await prisma.resumeVersion.findFirst({
      where: { id, studentId: userId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    const resume = await prisma.resumeVersion.update({
      where: { id },
      data: {
        ...(jobTitle && { jobTitle }),
        ...(content && { content: JSON.stringify(content) })
      }
    });
    res.json({ resume });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  const { id } = req.params;
  
  try {
    const existing = await prisma.resumeVersion.findFirst({
      where: { id, studentId: userId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    await prisma.resumeVersion.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
