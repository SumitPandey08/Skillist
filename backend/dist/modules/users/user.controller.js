"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.updateResume = exports.saveResume = exports.getResumes = exports.searchCandidates = exports.getCompanyProfile = exports.getCompanyCandidates = exports.getCompanyDashboard = exports.getMockInterviews = exports.getRoadmaps = exports.updateApplicationStatusByAppId = exports.updatePlatformConnections = exports.updateBio = exports.deleteCertification = exports.addCertification = exports.deleteProject = exports.addProject = exports.removeSkill = exports.addSkill = exports.getStudentFullProfile = exports.getStudentDashboard = exports.getPortfolioBySlug = void 0;
const prisma_1 = require("../../lib/prisma");
const nanoid_1 = require("nanoid");
// --- Student Controllers ---
const getPortfolioBySlug = async (req, res, next) => {
    const { slug } = req.params;
    try {
        const student = await prisma_1.prisma.student.findUnique({
            where: { slug: slug },
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
    }
    catch (error) {
        next(error);
    }
};
exports.getPortfolioBySlug = getPortfolioBySlug;
const getStudentDashboard = async (req, res, next) => {
    const userId = req.auth.userId;
    try {
        const student = await prisma_1.prisma.student.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentDashboard = getStudentDashboard;
const getStudentFullProfile = async (req, res, next) => {
    const userId = req.auth.userId;
    try {
        const student = await prisma_1.prisma.student.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentFullProfile = getStudentFullProfile;
const addSkill = async (req, res, next) => {
    const userId = req.auth.userId;
    const { name, category, proficiency } = req.body;
    try {
        const skill = await prisma_1.prisma.skill.upsert({
            where: { name },
            update: {},
            create: { id: (0, nanoid_1.nanoid)(), name, category }
        });
        await prisma_1.prisma.studentSkill.upsert({
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
    }
    catch (error) {
        next(error);
    }
};
exports.addSkill = addSkill;
const removeSkill = async (req, res, next) => {
    const userId = req.auth.userId;
    const { skillId } = req.params;
    try {
        await prisma_1.prisma.studentSkill.delete({
            where: {
                studentId_skillId: {
                    studentId: userId,
                    skillId
                }
            }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.removeSkill = removeSkill;
const addProject = async (req, res, next) => {
    const { title, description, url, imageUrl, startDate, endDate } = req.body;
    try {
        const project = await prisma_1.prisma.project.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
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
    }
    catch (error) {
        next(error);
    }
};
exports.addProject = addProject;
const deleteProject = async (req, res, next) => {
    const userId = req.auth.userId;
    const { id } = req.params;
    try {
        await prisma_1.prisma.project.delete({
            where: { id, studentId: userId }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
const addCertification = async (req, res, next) => {
    const userId = req.auth.userId;
    const { name, issuer, issueDate, credentialUrl } = req.body;
    try {
        await prisma_1.prisma.certification.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                studentId: userId,
                name,
                issuer,
                issueDate: issueDate ? new Date(issueDate) : null,
                credentialUrl
            }
        });
        res.status(201).json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.addCertification = addCertification;
const deleteCertification = async (req, res, next) => {
    const userId = req.auth.userId;
    const { id } = req.params;
    try {
        await prisma_1.prisma.certification.delete({
            where: { id, studentId: userId }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCertification = deleteCertification;
const updateBio = async (req, res, next) => {
    const userId = req.auth.userId;
    const { bio } = req.body;
    try {
        await prisma_1.prisma.student.update({
            where: { id: userId },
            data: { bio, updatedAt: new Date() }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBio = updateBio;
const updatePlatformConnections = async (req, res, next) => {
    const userId = req.auth.userId;
    const { githubUrl, leetcodeUrl, codeforcesUrl, linkedinUrl } = req.body;
    const extractUsername = (url) => {
        if (!url)
            return null;
        const cleanUrl = url.trim().replace(/\/$/, "");
        return cleanUrl.split("/").pop() || null;
    };
    try {
        await prisma_1.prisma.student.update({
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
    }
    catch (error) {
        next(error);
    }
};
exports.updatePlatformConnections = updatePlatformConnections;
const updateApplicationStatusByAppId = async (req, res, next) => {
    const userId = req.auth.userId;
    const { appId } = req.params;
    const { status } = req.body;
    try {
        const application = await prisma_1.prisma.application.findUnique({
            where: { id: appId },
            include: { job: true }
        });
        if (!application || application.job.companyId !== userId) {
            return res.status(403).json({ error: 'Forbidden or not found' });
        }
        await prisma_1.prisma.application.update({
            where: { id: appId },
            data: { status, updatedAt: new Date() }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplicationStatusByAppId = updateApplicationStatusByAppId;
const getRoadmaps = async (req, res, next) => {
    try {
        const roadmaps = await prisma_1.prisma.roadmap.findMany({
            where: { studentId: req.auth.userId },
            include: { steps: { orderBy: { order: 'asc' } } }
        });
        res.json(roadmaps);
    }
    catch (error) {
        next(error);
    }
};
exports.getRoadmaps = getRoadmaps;
const getMockInterviews = async (req, res, next) => {
    try {
        const interviews = await prisma_1.prisma.mockInterview.findMany({
            where: { studentId: req.auth.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(interviews);
    }
    catch (error) {
        next(error);
    }
};
exports.getMockInterviews = getMockInterviews;
// --- Company Controllers ---
const getCompanyDashboard = async (req, res, next) => {
    const userId = req.auth.userId;
    try {
        const company = await prisma_1.prisma.company.findUnique({
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
        if (!company)
            return res.status(404).json({ error: 'Company not found' });
        const totalJobs = company.jobs.length;
        const activeJobs = company.jobs.filter(j => j.status === 'active').length;
        let totalApplications = 0;
        let highMatchCandidates = 0;
        const allApplications = [];
        company.jobs.forEach(job => {
            totalApplications += job.applications.length;
            job.applications.forEach(app => {
                if (app.matchScore >= 80)
                    highMatchCandidates++;
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCompanyDashboard = getCompanyDashboard;
const getCompanyCandidates = async (req, res, next) => {
    const userId = req.auth.userId;
    const { jobId } = req.query;
    try {
        const company = await prisma_1.prisma.company.findUnique({
            where: { id: userId },
            include: {
                jobs: {
                    where: jobId ? { id: jobId } : undefined,
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
        if (!company)
            return res.status(404).json({ error: 'Company not found' });
        const allApplications = [];
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCompanyCandidates = getCompanyCandidates;
const getCompanyProfile = async (req, res, next) => {
    const userId = req.auth.userId;
    try {
        const company = await prisma_1.prisma.company.findUnique({
            where: { id: userId },
            include: {
                user: true
            }
        });
        res.json({ company });
    }
    catch (error) {
        next(error);
    }
};
exports.getCompanyProfile = getCompanyProfile;
const searchCandidates = async (req, res, next) => {
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
        const candidates = await prisma_1.prisma.student.findMany({
            where: whereClause,
            include: {
                skills: { include: { skill: true } },
                experience: true
            },
            take: 20
        });
        res.json(candidates);
    }
    catch (error) {
        next(error);
    }
};
exports.searchCandidates = searchCandidates;
// --- Resume Controllers ---
const getResumes = async (req, res, next) => {
    const userId = req.auth.userId;
    try {
        const resumes = await prisma_1.prisma.resumeVersion.findMany({
            where: { studentId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ resumes });
    }
    catch (error) {
        next(error);
    }
};
exports.getResumes = getResumes;
const saveResume = async (req, res, next) => {
    const userId = req.auth.userId;
    const { jobTitle, content } = req.body;
    try {
        const resume = await prisma_1.prisma.resumeVersion.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                studentId: userId,
                jobTitle: jobTitle || 'General',
                content: JSON.stringify(content)
            }
        });
        res.json({ resume });
    }
    catch (error) {
        next(error);
    }
};
exports.saveResume = saveResume;
const updateResume = async (req, res, next) => {
    const userId = req.auth.userId;
    const { id } = req.params;
    const { jobTitle, content } = req.body;
    try {
        const existing = await prisma_1.prisma.resumeVersion.findFirst({
            where: { id, studentId: userId }
        });
        if (!existing) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        const resume = await prisma_1.prisma.resumeVersion.update({
            where: { id },
            data: {
                ...(jobTitle && { jobTitle }),
                ...(content && { content: JSON.stringify(content) })
            }
        });
        res.json({ resume });
    }
    catch (error) {
        next(error);
    }
};
exports.updateResume = updateResume;
const deleteResume = async (req, res, next) => {
    const userId = req.auth.userId;
    const { id } = req.params;
    try {
        const existing = await prisma_1.prisma.resumeVersion.findFirst({
            where: { id, studentId: userId }
        });
        if (!existing) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        await prisma_1.prisma.resumeVersion.delete({
            where: { id }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteResume = deleteResume;
//# sourceMappingURL=user.controller.js.map