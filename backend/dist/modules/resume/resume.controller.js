"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParsingStatus = exports.uploadResume = void 0;
const prisma_1 = require("../../lib/prisma");
const queues_1 = require("../../core/queues");
const nanoid_1 = require("nanoid");
const resumeQueue = (0, queues_1.createQueue)('resume-parsing');
const uploadResume = async (req, res, next) => {
    const userId = req.auth.userId;
    const { fileUrl } = req.body;
    try {
        const resume = await prisma_1.prisma.resume.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                studentId: userId,
                fileUrl,
                status: 'pending'
            }
        });
        await resumeQueue.add('parse-resume', {
            resumeId: resume.id,
            userId,
            fileUrl
        });
        res.json({ success: true, resumeId: resume.id });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadResume = uploadResume;
const getParsingStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const resume = await prisma_1.prisma.resume.findUnique({
            where: { id }
        });
        res.json(resume);
    }
    catch (error) {
        next(error);
    }
};
exports.getParsingStatus = getParsingStatus;
//# sourceMappingURL=resume.controller.js.map