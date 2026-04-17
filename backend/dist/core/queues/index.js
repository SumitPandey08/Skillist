"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = exports.createQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../logger"));
const createQueue = (name) => {
    const queue = new bullmq_1.Queue(name, { connection: redis_1.redisConnection });
    queue.on('error', (err) => {
        // Silent fail if it's a connection error, it's already logged in redis.ts
        if (!err.message.includes('ECONNREFUSED')) {
            logger_1.default.error(`Queue ${name} error: ${err.message}`);
        }
    });
    return queue;
};
exports.createQueue = createQueue;
const createWorker = (name, processor) => {
    const worker = new bullmq_1.Worker(name, processor, { connection: redis_1.redisConnection });
    worker.on('error', (err) => {
        // Silent fail if it's a connection error, it's already logged in redis.ts
        if (!err.message.includes('ECONNREFUSED')) {
            logger_1.default.error(`Worker ${name} error: ${err.message}`);
        }
    });
    worker.on('completed', (job) => {
        logger_1.default.info(`Job ${job.id} in queue ${name} completed`);
    });
    worker.on('failed', (job, err) => {
        logger_1.default.error(`Job ${job?.id} in queue ${name} failed: ${err.message}`);
    });
    return worker;
};
exports.createWorker = createWorker;
//# sourceMappingURL=index.js.map