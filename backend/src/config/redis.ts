import Redis from 'ioredis';
import { env } from './env';
import logger from '../core/logger';

export const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    // Exponential backoff with a cap of 2 seconds
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: true,
  enableOfflineQueue: true,
  lazyConnect: false,
});

let redisErrorLogged = false;

// Handle connection errors gracefully (suppress stack trace)
redisConnection.on('error', (err) => {
  if (!redisErrorLogged) {
    logger.warn(`Redis connection unavailable: ${err.message}. Queue operations will be unavailable.`);
    redisErrorLogged = true;
  }
  // We MUST keep at least one listener for 'error' to prevent the process from crashing
});

redisConnection.on('connect', () => {
  logger.info('Redis connected successfully');
  redisErrorLogged = false;
});

// Try to connect without blocking - silently fail if Redis is down
redisConnection.connect().catch(() => {
  // Silent catch - connection error already logged above
});
