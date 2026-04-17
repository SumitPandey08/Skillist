"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationWorker = void 0;
const queues_1 = require("../../core/queues");
const integrations_service_1 = require("./integrations.service");
const logger_1 = __importDefault(require("../../core/logger"));
exports.integrationWorker = (0, queues_1.createWorker)('external-intelligence', async (job) => {
    const { studentId, platform, username } = job.data;
    logger_1.default.info(`Background sync for ${studentId} on ${platform}`);
    try {
        if (platform === 'github') {
            await integrations_service_1.IntegrationService.syncGitHub(studentId, username);
        }
        else if (platform === 'leetcode') {
            await integrations_service_1.IntegrationService.syncLeetCode(studentId, username);
        }
        await integrations_service_1.IntegrationService.calculateScores(studentId);
    }
    catch (error) {
        logger_1.default.error(`Sync failed for ${studentId} on ${platform}: ${error.message}`);
    }
});
//# sourceMappingURL=integrations.worker.js.map