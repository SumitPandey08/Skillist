import { resumeWorker } from './modules/resume/resume.worker';
import { integrationWorker } from './modules/integrations/integrations.worker';
import { agentWorker } from './modules/agentic-ai/agent.worker';
import logger from './core/logger';

logger.info('ECHFLUX Worker Service started');

// Register all workers
const workers = [
  resumeWorker,
  integrationWorker,
  agentWorker,
];

process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  await Promise.all(workers.map(w => w.close()));
  process.exit(0);
});
