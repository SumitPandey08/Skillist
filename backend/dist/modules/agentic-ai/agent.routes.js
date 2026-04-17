"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queues_1 = require("../../core/queues");
const logger_1 = __importDefault(require("../../core/logger"));
const resume_1 = require("../../lib/ai/resume");
const auth_1 = require("../../core/middlewares/auth");
const router = (0, express_1.Router)();
const agentQueue = (0, queues_1.createQueue)('agent-queue');
router.post('/refine-roadmap', auth_1.requireStudent, async (req, res) => {
    try {
        const { roadmapId, targetRole, currentSkills, initialRoadmap } = req.body;
        const studentId = req.auth.userId;
        if (!roadmapId)
            return res.status(400).json({ error: 'Missing roadmapId' });
        await agentQueue.add('refine-roadmap', {
            type: 'refine-roadmap',
            payload: { roadmapId, studentId, targetRole, currentSkills, initialRoadmap }
        });
        res.json({ success: true, message: 'Refinement job queued' });
    }
    catch (error) {
        logger_1.default.error(`Failed to queue refinement job: ${error.message}`);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
router.post('/analyze-interview', auth_1.requireStudent, async (req, res) => {
    try {
        const { interviewId, role, transcript } = req.body;
        const studentId = req.auth.userId;
        if (!interviewId)
            return res.status(400).json({ error: 'Missing interviewId' });
        await agentQueue.add('analyze-interview', {
            type: 'analyze-interview',
            payload: { interviewId, studentId, role, transcript }
        });
        res.json({ success: true, message: 'Interview analysis job queued' });
    }
    catch (error) {
        logger_1.default.error(`Failed to queue interview analysis: ${error.message}`);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
router.post('/analyze-skills', auth_1.requireStudent, async (req, res) => {
    try {
        const { targetRole, currentSkills } = req.body;
        const studentId = req.auth.userId;
        if (!studentId)
            return res.status(400).json({ error: 'Missing studentId' });
        await agentQueue.add('analyze-skills', {
            type: 'analyze-skills',
            payload: { studentId, targetRole, currentSkills }
        });
        res.json({ success: true, message: 'Skill analysis job queued' });
    }
    catch (error) {
        logger_1.default.error(`Failed to queue skill analysis: ${error.message}`);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
router.post('/generate-resume', async (req, res) => {
    try {
        const { student, targetRole } = req.body;
        if (!student)
            return res.status(400).json({ error: 'Missing student data' });
        await agentQueue.add('generate-resume', {
            type: 'generate-resume',
            payload: { student, targetRole }
        });
        res.json({ success: true, message: 'Resume generation job queued' });
    }
    catch (error) {
        logger_1.default.error(`Failed to queue resume generation: ${error.message}`);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
router.post('/resume/generate', auth_1.requireStudent, async (req, res) => {
    try {
        const { student, targetRole, modelProvider, industry } = req.body;
        if (!student)
            return res.status(400).json({ error: 'Missing student data' });
        if (!targetRole)
            return res.status(400).json({ error: 'Missing targetRole' });
        logger_1.default.info(`Generating resume for target role: ${targetRole}, model: ${modelProvider || 'default'}`);
        const resume = await (0, resume_1.generateResume)({
            student,
            targetRole,
            modelProvider: modelProvider || 'gemini-flash',
            industry: industry || 'technology'
        });
        res.json({
            resume,
            atsScore: resume.atsScore,
            suggestions: resume.suggestions,
        });
    }
    catch (error) {
        logger_1.default.error(`Failed to generate resume: ${error.message}`);
        res.status(500).json({ error: 'Failed to generate resume' });
    }
});
exports.default = router;
//# sourceMappingURL=agent.routes.js.map