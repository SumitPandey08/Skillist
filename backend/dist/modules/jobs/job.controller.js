"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationById = exports.updateApplicationStatus = exports.applyToJob = exports.deleteJob = exports.updateJobStatus = exports.updateJob = exports.createJob = exports.getCompanyJobDetails = exports.getJobById = exports.getCompanyJobs = exports.getJobs = void 0;
const prisma_1 = require("../../lib/prisma");
const matcher_1 = require("../../lib/ai/matcher");
const embeddings_1 = require("../../lib/ai/embeddings");
const nanoid_1 = require("nanoid");
const getJobs = async (req, res, next) => {
    try {
        const jobs = await prisma_1.prisma.job.findMany({
            where: { status: 'active' },
            include: { company: true },
        });
        res.json(jobs);
    }
    catch (error) {
        next(error);
    }
};
exports.getJobs = getJobs;
const getCompanyJobs = async (req, res, next) => {
    const userId = req.auth?.userId;
    try {
        const jobs = await prisma_1.prisma.job.findMany({
            where: { companyId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });
        res.json(jobs);
    }
    catch (error) {
        next(error);
    }
};
exports.getCompanyJobs = getCompanyJobs;
const getJobById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const job = await prisma_1.prisma.job.findUnique({
            where: { id: id },
            include: {
                company: true,
                skills: { include: { skill: true } }
            }
        });
        if (!job)
            return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    }
    catch (error) {
        next(error);
    }
};
exports.getJobById = getJobById;
const getCompanyJobDetails = async (req, res, next) => {
    const userId = req.auth?.userId;
    const { id } = req.params;
    try {
        const job = await prisma_1.prisma.job.findUnique({
            where: { id },
            include: {
                skills: { include: { skill: true } }
            }
        });
        if (!job || job.companyId !== userId) {
            return res.status(403).json({ error: 'Forbidden or not found' });
        }
        res.json(job);
    }
    catch (error) {
        next(error);
    }
};
exports.getCompanyJobDetails = getCompanyJobDetails;
const createJob = async (req, res, next) => {
    const userId = req.auth?.userId;
    const { title, description, location, salaryRange, jobType, status, skills } = req.body;
    try {
        const jobId = (0, nanoid_1.nanoid)();
        const jobVector = await (0, embeddings_1.generateEmbedding)(`${title}\n${description}`);
        // Create job using transaction to handle skills and vector
        const job = await prisma_1.prisma.$transaction(async (tx) => {
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
            await tx.$executeRawUnsafe(`UPDATE jobs SET job_vector = cast($1 as vector) WHERE id = $2`, `[${jobVector.join(',')}]`, jobId);
            // Add skills
            if (skills && Array.isArray(skills)) {
                for (const skillItem of skills) {
                    const skillText = typeof skillItem === 'string' ? skillItem : skillItem.text;
                    const skill = await tx.skill.upsert({
                        where: { name: skillText },
                        update: {},
                        create: { id: (0, nanoid_1.nanoid)(), name: skillText }
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
    }
    catch (error) {
        next(error);
    }
};
exports.createJob = createJob;
const updateJob = async (req, res, next) => {
    const userId = req.auth?.userId;
    const { id } = req.params;
    const { title, description, location, salaryRange, jobType, status, skills } = req.body;
    try {
        const existingJob = await prisma_1.prisma.job.findUnique({ where: { id } });
        if (!existingJob || existingJob.companyId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const jobVector = await (0, embeddings_1.generateEmbedding)(`${title}\n${description}`);
        await prisma_1.prisma.$transaction(async (tx) => {
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
            await tx.$executeRawUnsafe(`UPDATE jobs SET job_vector = cast($1 as vector) WHERE id = $2`, `[${jobVector.join(',')}]`, id);
            // Sync skills
            await tx.jobSkill.deleteMany({ where: { jobId: id } });
            if (skills && Array.isArray(skills)) {
                for (const skillItem of skills) {
                    const skillText = typeof skillItem === 'string' ? skillItem : skillItem.text;
                    const skill = await tx.skill.upsert({
                        where: { name: skillText },
                        update: {},
                        create: { id: (0, nanoid_1.nanoid)(), name: skillText }
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateJob = updateJob;
const updateJobStatus = async (req, res, next) => {
    const userId = req.auth?.userId;
    const { id } = req.params;
    const { status } = req.body;
    try {
        const job = await prisma_1.prisma.job.findUnique({ where: { id } });
        if (!job || job.companyId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await prisma_1.prisma.job.update({
            where: { id },
            data: { status, updatedAt: new Date() }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJobStatus = updateJobStatus;
const deleteJob = async (req, res, next) => {
    const userId = req.auth?.userId;
    const { id } = req.params;
    try {
        const job = await prisma_1.prisma.job.findUnique({ where: { id } });
        if (!job || job.companyId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await prisma_1.prisma.job.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJob = deleteJob;
const applyToJob = async (req, res, next) => {
    const userId = req.auth?.userId;
    const jobId = req.params.id;
    try {
        const existing = await prisma_1.prisma.application.findFirst({
            where: { studentId: userId, jobId },
        });
        if (existing) {
            return res.status(400).json({ error: 'Already applied' });
        }
        const scores = await (0, matcher_1.calculateMatchScore)(userId, jobId);
        const application = await prisma_1.prisma.application.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
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
    }
    catch (error) {
        next(error);
    }
};
exports.applyToJob = applyToJob;
const updateApplicationStatus = async (req, res, next) => {
    const userId = req.auth?.userId;
    const { status } = req.body;
    const { jobId, appId } = req.params;
    try {
        const job = await prisma_1.prisma.job.findUnique({ where: { id: jobId } });
        if (job?.companyId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const application = await prisma_1.prisma.application.update({
            where: { id: appId },
            data: { status }
        });
        res.json({ success: true, application });
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getApplicationById = async (req, res, next) => {
    const userId = req.auth?.userId;
    const { appId } = req.params;
    try {
        const application = await prisma_1.prisma.application.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getApplicationById = getApplicationById;
//# sourceMappingURL=job.controller.js.map