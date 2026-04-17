"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../core/logger"));
exports.redisConnection = new ioredis_1.default(env_1.env.REDIS_URL, {
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
exports.redisConnection.on('error', (err) => {
    if (!redisErrorLogged) {
        logger_1.default.warn(`Redis connection unavailable: ${err.message}. Queue operations will be unavailable.`);
        redisErrorLogged = true;
    }
    // We MUST keep at least one listener for 'error' to prevent the process from crashing
});
exports.redisConnection.on('connect', () => {
    logger_1.default.info('Redis connected successfully');
    redisErrorLogged = false;
});
// Try to connect without blocking - silently fail if Redis is down
exports.redisConnection.connect().catch(() => {
    // Silent catch - connection error already logged above
});
//# sourceMappingURL=redis.js.map