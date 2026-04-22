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
        },
        careerRecommendations: {
          orderBy: { createdAt: 'desc' },
          take: 1
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
                student: {
                  include: {
                    skills: { include: { skill: true } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!company) return res.status(404).json({ error: 'Company not found' });

    const totalJobs = company.jobs.length;
    const activeJobsCount = company.jobs.filter(j => j.status === 'active').length;
    let totalApplications = 0;
    let highMatchCandidates = 0;
    const allApplications: any[] = [];
    
    // For insights
    const skillDistribution: Record<string, number> = {};
    const applicationTrends: Record<string, number> = {};

    company.jobs.forEach(job => {
      totalApplications += job.applications.length;
      job.applications.forEach(app => {
        if (app.matchScore >= 80) highMatchCandidates++;
        
        // Trends
        const date = app.createdAt.toISOString().split('T')[0];
        applicationTrends[date] = (applicationTrends[date] || 0) + 1;

        // Skills
        app.student.skills.forEach(s => {
          skillDistribution[s.skill.name] = (skillDistribution[s.skill.name] || 0) + 1;
        });

        allApplications.push({
          id: app.id,
          jobId: job.id,
          studentName: app.student.name,
          studentSlug: app.student.slug,
          jobTitle: job.title,
          matchScore: app.matchScore,
          skillScore: app.skillScore,
          expScore: app.expScore,
          projScore: app.projScore,
          potentialScore: app.potentialScore,
          status: app.status,
          appliedAt: app.createdAt,
        });
      });
    });

    const topTalent = allApplications
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    const recentJobs = company.jobs
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(j => ({
        id: j.id,
        title: j.title,
        status: j.status,
        applicantsCount: j.applications.length,
        createdAt: j.createdAt,
      }));

    // Sourcing: Find students NOT yet applied to any of this company's jobs
    // but who have high skill overlap with active jobs
    const appliedStudentIds = allApplications.map(a => a.studentId);
    const recommendedStudents = await prisma.student.findMany({
      where: {
        id: { notIn: appliedStudentIds }
      },
      include: {
        skills: { include: { skill: true } }
      },
      take: 5
    });

    res.json({
      company,
      analytics: {
        totalJobs,
        activeJobs: activeJobsCount,
        totalApplications,
        highMatchCandidates,
        skillDistribution,
        applicationTrends
      },
      topTalent,
      recentJobs,
      recommendedStudents: recommendedStudents.map(s => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        primarySkill: s.primarySkill,
        skills: s.skills.map(sk => sk.skill.name)
      }))
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

export const getCompanyAnalytics = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.auth.userId;
  try {
    const jobs = await prisma.job.findMany({
      where: { companyId: userId },
      include: {
        applications: {
          include: {
            student: {
              include: {
                skills: { include: { skill: true } }
              }
            }
          }
        }
      }
    });

    const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0);
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'active').length;

    // Skill demand vs supply
    const skillDemand: Record<string, number> = {};
    const skillSupply: Record<string, number> = {};

    jobs.forEach(job => {
      job.applications.forEach(app => {
        app.student.skills.forEach(s => {
          skillSupply[s.skill.name] = (skillSupply[s.skill.name] || 0) + 1;
        });
      });
    });

    // Interview conversion rates
    const interviewCount = await prisma.mockInterview.count({
      where: { companyId: userId }
    });

    const acceptedCount = await prisma.application.count({
      where: { job: { companyId: userId }, status: 'accepted' }
    });

    const pipelineStats = {
      sourcing: totalApplications * 1.5, // Mock sourced candidates
      screening: totalApplications,
      interviewing: interviewCount,
      offered: acceptedCount
    };

    res.json({
      totalApplications,
      totalJobs,
      activeJobs,
      skillSupply,
      pipelineStats,
      conversionRate: totalApplications > 0 ? (acceptedCount / totalApplications) * 100 : 0
    });
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
