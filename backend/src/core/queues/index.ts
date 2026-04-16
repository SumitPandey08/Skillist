import { Queue, Worker, Job } from 'bullmq';
import { redisConnection } from '../../config/redis';
import logger from '../logger';

export const createQueue = (name: string) => {
  const queue = new Queue(name, { connection: redisConnection });
  queue.on('error', (err) => {
    // Silent fail if it's a connection error, it's already logged in redis.ts
    if (!err.message.includes('ECONNREFUSED')) {
      logger.error(`Queue ${name} error: ${err.message}`);
    }
  });
  return queue;
};

export const createWorker = (name: string, processor: (job: Job) => Promise<any>) => {
  const worker = new Worker(name, processor, { connection: redisConnection });

  worker.on('error', (err) => {
    // Silent fail if it's a connection error, it's already logged in redis.ts
    if (!err.message.includes('ECONNREFUSED')) {
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
