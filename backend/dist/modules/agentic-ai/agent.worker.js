"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentWorker = void 0;
const queues_1 = require("../../core/queues");
const roadmap_agent_1 = require("./roadmap-agent");
const interviewer_agent_1 = require("./interviewer-agent");
const skill_analysis_agent_1 = require("./skill-analysis-agent");
const prisma_1 = require("../../lib/prisma");
const logger_1 = __importDefault(require("../../core/logger"));
const nanoid_1 = require("nanoid");
exports.agentWorker = (0, queues_1.createWorker)('agent-queue', async (job) => {
    const { type, payload } = job.data;
    if (type === 'refine-roadmap') {
        const { roadmapId, studentId, targetRole, currentSkills, initialRoadmap } = payload;
        logger_1.default.info(`Agent Refining Roadmap: ${roadmapId}`);
        const result = await roadmap_agent_1.roadmapAgent.invoke({
            roadmapId, studentId, targetRole, currentSkills, refinedRoadmap: initialRoadmap
        });
        for (let i = 0; i < result.refinedRoadmap.steps.length; i++) {
            const step = result.refinedRoadmap.steps[i];
            const existingStep = await prisma_1.prisma.roadmapStep.findFirst({
                where: { roadmapId: roadmapId, order: i + 1 }
            });
            if (existingStep) {
                await prisma_1.prisma.roadmapStep.update({
                    where: { id: existingStep.id },
                    data: {
                        description: step.description,
                        notes: step.notes,
                        resources: {
                            videos: step.resources.videos,
                            links: step.resources.links,
                            prerequisites: step.prerequisites
                        }
                    }
                });
            }
        }
        logger_1.default.info(`Roadmap Refinement Complete: ${roadmapId}`);
        return { success: true };
    }
    if (type === 'analyze-interview') {
        const { interviewId, studentId, role, transcript } = payload;
        logger_1.default.info(`Agent Analyzing Interview: ${interviewId}`);
        const result = await interviewer_agent_1.interviewerAgent.invoke({
            targetRole: role, messages: transcript
        });
        await prisma_1.prisma.mockInterview.update({
            where: { id: interviewId },
            data: {
                score: result.refinedRoadmap.score,
                feedback: JSON.stringify({
                    overall: result.refinedRoadmap.feedback,
                    strengths: result.refinedRoadmap.strengths,
                    weaknesses: result.refinedRoadmap.weaknesses,
                    suggestions: result.refinedRoadmap.suggestions
                }),
                status: 'completed'
            }
        });
        logger_1.default.info(`Interview Analysis Complete: ${interviewId}`);
        return { success: true };
    }
    if (type === 'analyze-skills') {
        const { studentId, targetRole, currentSkills } = payload;
        logger_1.default.info(`Agent Analyzing Skills for Student: ${studentId}`);
        const result = await skill_analysis_agent_1.skillAnalysisAgent.invoke({
            targetRole, currentSkills
        });
        // Update or create normalized skills/insights
        await prisma_1.prisma.userScore.upsert({
            where: { studentId },
            update: {
                insights: JSON.stringify(result.refinedRoadmap),
                lastCalculated: new Date()
            },
            create: {
                id: (0, nanoid_1.nanoid)(),
                studentId,
                overallScore: result.refinedRoadmap.marketFit,
                insights: JSON.stringify(result.refinedRoadmap)
            }
        });
        logger_1.default.info(`Skill Analysis Complete: ${studentId}`);
        return { success: true };
    }
    throw new Error(`Unknown agent job type: ${type}`);
});
//# sourceMappingURL=agent.worker.js.map