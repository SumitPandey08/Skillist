import { createWorker } from '../../core/queues';
import { IntegrationService } from './integrations.service';
import { prisma } from '../../lib/prisma';
import logger from '../../core/logger';

export const integrationWorker = createWorker('external-intelligence', async (job) => {
  const { studentId, platform, username } = job.data;
  
  logger.info(`Background sync for ${studentId} on ${platform}`);

  try {
    if (platform === 'github') {
      await IntegrationService.syncGitHub(studentId, username);
    } else if (platform === 'leetcode') {
      await IntegrationService.syncLeetCode(studentId, username);
    }

    await IntegrationService.calculateScores(studentId);
  } catch (error: any) {
    logger.error(`Sync failed for ${studentId} on ${platform}: ${error.message}`);
  }
});
