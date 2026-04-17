"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resume_worker_1 = require("./modules/resume/resume.worker");
const integrations_worker_1 = require("./modules/integrations/integrations.worker");
const agent_worker_1 = require("./modules/agentic-ai/agent.worker");
const logger_1 = __importDefault(require("./core/logger"));
logger_1.default.info('ECHFLUX Worker Service started');
// Register all workers
const workers = [
    resume_worker_1.resumeWorker,
    integrations_worker_1.integrationWorker,
    agent_worker_1.agentWorker,
];
process.on('SIGTERM', async () => {
    logger_1.default.info('Shutting down workers...');
    await Promise.all(workers.map(w => w.close()));
    process.exit(0);
});
//# sourceMappingURL=worker.js.map