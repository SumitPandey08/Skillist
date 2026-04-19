import { Queue, Worker, Job } from 'bullmq';
import { redisConnection, isRedisConnected } from '../../config/redis';
import logger from '../logger';

/**
 * Enhanced queue creator that handles Redis unavailability gracefully
 */
export const createQueue = (name: string) => {
  // If Redis is not available, return a mock queue to prevent app crash
  if (!isRedisConnected) {
    logger.debug(`Queue ${name} initialized in MOCK mode (Redis unavailable)`);
    return {
      add: async () => {
        logger.warn(`Queue ${name}: Action ignored - Redis connection is down`);
        return { id: 'mock-id' };
      },
      on: () => {},
      close: async () => {},
    } as unknown as Queue;
  }

  const queue = new Queue(name, { connection: redisConnection });
  
  queue.on('error', (err) => {
    // Only log if it's not a generic connection issue to reduce noise
    if (err.message && !err.message.includes('ECONNREFUSED')) {
      logger.error(`Queue ${name} error: ${err.message}`);
    }
  });

  return queue;
};

/**
 * Enhanced worker creator that handles Redis unavailability gracefully
 */
export const createWorker = (name: string, processor: (job: Job) => Promise<any>) => {
  if (!isRedisConnected) {
    logger.debug(`Worker ${name} skipped initialization (Redis unavailable)`);
    return {
      on: () => {},
      close: async () => {},
    } as unknown as Worker;
  }

  const worker = new Worker(name, processor, { connection: redisConnection });

  worker.on('error', (err) => {
    if (err.message && !err.message.includes('ECONNREFUSED')) {
      logger.error(`Worker ${name} error: ${err.message}`);
    }
  });

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} in queue ${name} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} in queue ${name} failed: ${err.message}`);
  });

  return worker;
};
