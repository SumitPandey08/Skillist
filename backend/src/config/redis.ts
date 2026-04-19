import Redis from 'ioredis';
import { env } from './env';
import logger from '../core/logger';

export const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    // Exponential backoff with a cap of 2 seconds
    const delay = Math.min(times * 100, 5000);
    return delay;
  },
  enableReadyCheck: true,
  enableOfflineQueue: false, // Disable offline queue to prevent memory build-up when Redis is down
  lazyConnect: true, // Don't connect immediately
});

export let isRedisConnected = false;
let redisErrorLogged = false;

// Handle connection errors gracefully
redisConnection.on('error', (err) => {
  isRedisConnected = false;
  if (!redisErrorLogged) {
    logger.warn(`Redis connection unavailable: ${err.message}. Queue operations will be unavailable.`);
    redisErrorLogged = true;
  }
});

redisConnection.on('connect', () => {
  isRedisConnected = true;
  logger.info('Redis connected successfully');
  redisErrorLogged = false;
});

redisConnection.on('close', () => {
  isRedisConnected = false;
});

// Try to connect initially
redisConnection.connect().catch(() => {
  isRedisConnected = false;
});
