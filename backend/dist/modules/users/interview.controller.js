"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeInterview = exports.addInterviewMessage = exports.getMockInterviewById = exports.createInterview = void 0;
const prisma_1 = require("../../lib/prisma");
const nanoid_1 = require("nanoid");
const interview_1 = require("../../lib/ai/interview");
const createInterview = async (req, res, next) => {
    const userId = req.auth.userId;
    const { role } = req.body;
    try {
        const interview = await prisma_1.prisma.mockInterview.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                studentId: userId,
                role,
                status: 'scheduled',
                updatedAt: new Date()
            }
        });
        res.json({ success: true, id: interview.id });
    }
    catch (error) {
        next(error);
    }
};
exports.createInterview = createInterview;
const getMockInterviewById = async (req, res, next) => {
    const userId = req.auth.userId;
    const { interviewId } = req.params;
    try {
        const interview = await prisma_1.prisma.mockInterview.findUnique({
            where: { id: interviewId },
            include: {
                messages: { orderBy: { createdAt: 'asc' } }
            }
        });
        if (!interview || interview.studentId !== userId) {
            return res.status(404).json({ error: 'Interview not found' });
        }
        res.json(interview);
    }
    catch (error) {
        next(error);
    }
};
exports.getMockInterviewById = getMockInterviewById;
const addInterviewMessage = async (req, res, next) => {
    const userId = req.auth.userId;
    const { interviewId } = req.params;
    const { role, content } = req.body; // role: 'candidate' or 'interviewer'
    try {
        const interview = await prisma_1.prisma.mockInterview.findUnique({
            where: { id: interviewId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
        if (!interview || interview.studentId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const msgId = (0, nanoid_1.nanoid)();
        await prisma_1.prisma.interviewMessage.create({
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
        const history = (interview.messages || []).map(m => ({
            role: m.role === 'interviewer' ? 'assistant' : 'user',
            content: m.content
        }));
        history.push({ role: 'user', content });
        try {
            const aiQuestion = await (0, interview_1.getNextInterviewQuestion)(interview.role, history);
            const aiMsgId = (0, nanoid_1.nanoid)();
            await prisma_1.prisma.interviewMessage.create({
                data: {
                    id: aiMsgId,
                    interviewId,
                    role: 'interviewer',
                    content: aiQuestion
                }
            });
            await prisma_1.prisma.mockInterview.update({
                where: { id: interviewId },
                data: { status: 'in_progress', updatedAt: new Date() }
            });
            res.json({ success: true, id: aiMsgId, content: aiQuestion });
        }
        catch (aiError) {
            console.error('AI Interview Error:', aiError);
            // Fallback
            const fallback = "Could you tell me more about your experience with complex systems?";
            const aiMsgId = (0, nanoid_1.nanoid)();
            await prisma_1.prisma.interviewMessage.create({
                data: { id: aiMsgId, interviewId, role: 'interviewer', content: fallback }
            });
            res.json({ success: true, id: aiMsgId, content: fallback });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addInterviewMessage = addInterviewMessage;
const completeInterview = async (req, res, next) => {
    const userId = req.auth.userId;
    const { interviewId } = req.params;
    try {
        const interview = await prisma_1.prisma.mockInterview.findUnique({
            where: { id: interviewId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
        if (!interview || interview.studentId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        // 1. Mark as completed
        await prisma_1.prisma.mockInterview.update({
            where: { id: interviewId },
            data: { status: 'completed', updatedAt: new Date() }
        });
        // 2. Perform AI Analysis
        const history = (interview.messages || []).map(m => ({
            role: m.role === 'interviewer' ? 'assistant' : 'user',
            content: m.content
        }));
        const evaluation = await (0, interview_1.analyzeInterviewPerformance)(interview.role, history);
        // 3. Save Evaluation
        await prisma_1.prisma.mockInterview.update({
            where: { id: interviewId },
            data: {
                score: evaluation.score,
                feedback: JSON.stringify(evaluation),
                updatedAt: new Date()
            }
        });
        res.json({ success: true, evaluation });
    }
    catch (error) {
        next(error);
    }
};
exports.completeInterview = completeInterview;
//# sourceMappingURL=interview.controller.js.map