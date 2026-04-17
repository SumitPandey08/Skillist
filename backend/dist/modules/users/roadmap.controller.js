"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoadmap = exports.updateRoadmapStep = exports.createRoadmap = void 0;
const prisma_1 = require("../../lib/prisma");
const nanoid_1 = require("nanoid");
const roadmap_1 = require("../../lib/ai/roadmap");
const createRoadmap = async (req, res, next) => {
    const userId = req.auth.userId;
    const { targetRole } = req.body;
    try {
        // 1. Get current skills
        const student = await prisma_1.prisma.student.findUnique({
            where: { id: userId },
            include: { skills: { include: { skill: true } } }
        });
        const currentSkills = student?.skills.map(s => s.skill.name) || [];
        // 2. Generate Roadmap with AI
        const aiRoadmap = await (0, roadmap_1.generateRoadmap)(targetRole, currentSkills);
        // 3. Save to DB (Replace existing)
        const roadmap = await prisma_1.prisma.$transaction(async (tx) => {
            await tx.roadmap.deleteMany({ where: { studentId: userId } });
            return await tx.roadmap.create({
                data: {
                    id: (0, nanoid_1.nanoid)(),
                    studentId: userId,
                    targetRole,
                    description: aiRoadmap.description,
                    progress: 0,
                    steps: {
                        create: await Promise.all(aiRoadmap.steps.map(async (step, i) => {
                            let skillId = null;
                            if (step.skill_name) {
                                const matchedSkill = await tx.skill.findUnique({ where: { name: step.skill_name } });
                                skillId = matchedSkill?.id || null;
                            }
                            return {
                                id: (0, nanoid_1.nanoid)(),
                                title: step.title,
                                description: step.description,
                                notes: step.notes,
                                resources: {
                                    videos: step.resources.videos,
                                    links: step.resources.links,
                                    prerequisites: step.prerequisites
                                },
                                skillId,
                                order: i + 1,
                                status: 'pending'
                            };
                        }))
                    }
                },
                include: { steps: true }
            });
        });
        // 4. Trigger refinement in background (Internal call or Queue)
        try {
            // Use internal backend URL or just trigger via queue if available
            // For now, we'll assume the queue is available
            const agentQueue = (req.app.get('queues') || {})['agent-queue'];
            if (agentQueue) {
                await agentQueue.add('refine-roadmap', {
                    type: 'refine-roadmap',
                    payload: {
                        roadmapId: roadmap.id,
                        studentId: userId,
                        targetRole,
                        currentSkills,
                        initialRoadmap: aiRoadmap
                    }
                });
            }
        }
        catch (err) {
            console.error('Failed to trigger roadmap refinement:', err);
        }
        res.json({ success: true, roadmap });
    }
    catch (error) {
        next(error);
    }
};
exports.createRoadmap = createRoadmap;
const updateRoadmapStep = async (req, res, next) => {
    const userId = req.auth.userId;
    const { stepId } = req.params;
    const { status } = req.body;
    try {
        const step = await prisma_1.prisma.roadmapStep.findUnique({
            where: { id: stepId },
            include: { roadmap: true }
        });
        if (!step || step.roadmap.studentId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await prisma_1.prisma.roadmapStep.update({
            where: { id: stepId },
            data: { status, updatedAt: new Date() }
        });
        // Update overall progress
        const allSteps = await prisma_1.prisma.roadmapStep.findMany({
            where: { roadmapId: step.roadmapId }
        });
        const completedSteps = allSteps.filter(s => s.status === 'completed').length;
        const progress = Math.round((completedSteps / allSteps.length) * 100);
        await prisma_1.prisma.roadmap.update({
            where: { id: step.roadmapId },
            data: { progress, updatedAt: new Date() }
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRoadmapStep = updateRoadmapStep;
const deleteRoadmap = async (req, res, next) => {
    const userId = req.auth.userId;
    const { id } = req.params;
    try {
        const roadmap = await prisma_1.prisma.roadmap.findUnique({ where: { id } });
        if (!roadmap || roadmap.studentId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await prisma_1.prisma.roadmap.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRoadmap = deleteRoadmap;
//# sourceMappingURL=roadmap.controller.js.map