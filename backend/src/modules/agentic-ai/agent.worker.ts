import { createWorker } from '../../core/queues';
import { roadmapAgent } from './roadmap-agent';
import { interviewerAgent } from './interviewer-agent';
import { skillAnalysisAgent } from './skill-analysis-agent';
import { prisma } from '../../lib/prisma';
import logger from '../../core/logger';
import { nanoid } from 'nanoid';

export const agentWorker = createWorker('agent-queue', async (job) => {
  const { type, payload } = job.data;

  if (type === 'refine-roadmap') {
    const { roadmapId, studentId, targetRole, currentSkills, initialRoadmap } = payload;
    logger.info(`Agent Refining Roadmap: ${roadmapId}`);

    const result = await roadmapAgent.invoke({
      roadmapId, studentId, targetRole, currentSkills, refinedRoadmap: initialRoadmap
    });

    for (let i = 0; i < result.refinedRoadmap.steps.length; i++) {
        const step = result.refinedRoadmap.steps[i];
        const existingStep = await prisma.roadmapStep.findFirst({
            where: { roadmapId: roadmapId, order: i + 1 }
        });
        if (existingStep) {
            await prisma.roadmapStep.update({
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
    logger.info(`Roadmap Refinement Complete: ${roadmapId}`);
    return { success: true };
  }

  if (type === 'analyze-interview') {
    const { interviewId, studentId, role, transcript } = payload;
    logger.info(`Agent Analyzing Interview: ${interviewId}`);

    const result = await interviewerAgent.invoke({
      targetRole: role, messages: transcript
    });

    await prisma.mockInterview.update({
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

    logger.info(`Interview Analysis Complete: ${interviewId}`);
    return { success: true };
  }

  if (type === 'analyze-skills') {
    const { studentId, targetRole, currentSkills } = payload;
    logger.info(`Agent Analyzing Skills for Student: ${studentId}`);

    const result = await skillAnalysisAgent.invoke({
      targetRole, currentSkills
    });

    // Update or create normalized skills/insights
    await prisma.userScore.upsert({
        where: { studentId },
        update: {
            insights: JSON.stringify(result.refinedRoadmap),
            lastCalculated: new Date()
        },
        create: {
            id: nanoid(),
            studentId,
            overallScore: result.refinedRoadmap.marketFit,
            insights: JSON.stringify(result.refinedRoadmap)
        }
    });

    logger.info(`Skill Analysis Complete: ${studentId}`);
    return { success: true };
  }

  throw new Error(`Unknown agent job type: ${type}`);
});
