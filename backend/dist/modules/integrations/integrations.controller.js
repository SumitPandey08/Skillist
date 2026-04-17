"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntelligence = exports.syncAll = void 0;
const integrations_service_1 = require("./integrations.service");
const prisma_1 = require("../../lib/prisma");
const syncAll = async (req, res, next) => {
    const studentId = req.auth.userId;
    try {
        const student = await prisma_1.prisma.student.findUnique({ where: { id: studentId } });
        if (!student)
            return res.status(404).json({ error: 'Student not found' });
        if (student.githubUsername) {
            await integrations_service_1.IntegrationService.syncGitHub(studentId, student.githubUsername);
        }
        if (student.leetcodeUsername) {
            await integrations_service_1.IntegrationService.syncLeetCode(studentId, student.leetcodeUsername);
        }
        if (student.codeforcesUsername) {
            await integrations_service_1.IntegrationService.syncCodeforces(studentId, student.codeforcesUsername);
        }
        const scores = await integrations_service_1.IntegrationService.calculateScores(studentId);
        res.json({ success: true, scores });
    }
    catch (error) {
        next(error);
    }
};
exports.syncAll = syncAll;
const getIntelligence = async (req, res, next) => {
    const studentId = req.params.studentId || req.auth.userId;
    try {
        const data = await prisma_1.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                externalAccounts: {
                    include: { githubData: true, leetcodeData: true }
                },
                normalizedSkills: true,
                scores: true
            }
        });
        if (!data)
            return res.status(404).json({ error: 'Student data not found' });
        res.json(data);
    }
    catch (error) {
        next(error);
    }
};
exports.getIntelligence = getIntelligence;
//# sourceMappingURL=integrations.controller.js.map