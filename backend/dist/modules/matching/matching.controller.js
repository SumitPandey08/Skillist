"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateInterview = exports.createRoadmap = exports.tailorResume = void 0;
const prisma_1 = require("../../lib/prisma");
const resume_1 = require("../../lib/ai/resume");
const roadmap_1 = require("../../lib/ai/roadmap");
const interview_1 = require("../../lib/ai/interview");
const tailorResume = async (req, res, next) => {
    const userId = req.auth.userId;
    const jobId = req.params.jobId;
    try {
        const student = await prisma_1.prisma.student.findUnique({
            where: { id: userId },
            include: { experience: true, projects: true },
        });
        const job = await prisma_1.prisma.job.findUnique({ where: { id: jobId } });
        if (!student || !job)
            return res.status(404).json({ error: 'Not found' });
        const tailored = await (0, resume_1.tailorResumeData)({
            studentProfile: student,
            experience: student.experience,
            projects: student.projects,
            jobDescription: `${job.title}\n${job.description}`,
        });
        res.json(tailored);
    }
    catch (error) {
        next(error);
    }
};
exports.tailorResume = tailorResume;
const createRoadmap = async (req, res, next) => {
    const userId = req.auth.userId;
    const { targetRole } = req.body;
    try {
        const student = await prisma_1.prisma.student.findUnique({
            where: { id: userId },
            include: { skills: { include: { skill: true } } }
        });
        const currentSkills = student?.skills.map(s => s.skill.name) || [];
        const roadmap = await (0, roadmap_1.generateRoadmap)(targetRole, currentSkills);
        res.json({ success: true, roadmap });
    }
    catch (error) {
        next(error);
    }
};
exports.createRoadmap = createRoadmap;
const evaluateInterview = async (req, res, next) => {
    const userId = req.auth.userId;
    const { role, question, answer } = req.body;
    try {
        const evaluation = await (0, interview_1.evaluateMockInterview)(userId, role, question, answer);
        res.json({ success: true, evaluation });
    }
    catch (error) {
        next(error);
    }
};
exports.evaluateInterview = evaluateInterview;
//# sourceMappingURL=matching.controller.js.map