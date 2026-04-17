"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeWorker = void 0;
const queues_1 = require("../../core/queues");
const prisma_1 = require("../../lib/prisma");
const logger_1 = __importDefault(require("../../core/logger"));
const pdf_1 = require("../../lib/ai/pdf");
const parser_1 = require("../../lib/ai/parser");
const axios_1 = __importDefault(require("axios"));
const nanoid_1 = require("nanoid");
exports.resumeWorker = (0, queues_1.createWorker)('resume-parsing', async (job) => {
    const { resumeId, userId, fileUrl } = job.data;
    logger_1.default.info(`Starting parsing for resume ${resumeId}`);
    try {
        await prisma_1.prisma.resume.update({
            where: { id: resumeId },
            data: { status: 'processing' }
        });
        // 1. Download the PDF
        const response = await axios_1.default.get(fileUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        // 2. Extract Text
        const text = await (0, pdf_1.extractTextFromPdf)(buffer);
        // 3. Parse with AI
        const extractedData = await (0, parser_1.extractResumeData)(text);
        // 4. Update Resume Status
        await prisma_1.prisma.resume.update({
            where: { id: resumeId },
            data: {
                status: 'completed',
                parsedData: JSON.stringify(extractedData)
            }
        });
        // 5. Sync to Student Profile (Atomic Transaction)
        await prisma_1.prisma.$transaction(async (tx) => {
            // Update student resume URL
            await tx.student.update({
                where: { id: userId },
                data: { resumeUrl: fileUrl }
            });
            // Sync Skills
            for (const skill of extractedData.skills) {
                const matchedSkill = await tx.skill.upsert({
                    where: { name: skill.name },
                    update: {},
                    create: { id: (0, nanoid_1.nanoid)(), name: skill.name }
                });
                await tx.studentSkill.upsert({
                    where: {
                        studentId_skillId: {
                            studentId: userId,
                            skillId: matchedSkill.id
                        }
                    },
                    update: { proficiency: skill.proficiency },
                    create: {
                        studentId: userId,
                        skillId: matchedSkill.id,
                        proficiency: skill.proficiency
                    }
                });
            }
            // Sync Experience
            await tx.experience.deleteMany({ where: { studentId: userId } });
            for (const exp of extractedData.experience) {
                await tx.experience.create({
                    data: {
                        id: (0, nanoid_1.nanoid)(),
                        studentId: userId,
                        title: exp.title,
                        company: exp.company,
                        location: exp.location || null,
                        description: exp.description,
                        startDate: new Date(exp.startDate),
                        endDate: exp.endDate && exp.endDate !== 'Present' ? new Date(exp.endDate) : null,
                    }
                });
            }
            // Sync Education
            await tx.education.deleteMany({ where: { studentId: userId } });
            for (const edu of extractedData.education) {
                await tx.education.create({
                    data: {
                        id: (0, nanoid_1.nanoid)(),
                        studentId: userId,
                        school: edu.school,
                        degree: edu.degree || null,
                        field: edu.field || null,
                        graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : null,
                    }
                });
            }
        });
        logger_1.default.info(`Completed parsing for resume ${resumeId} and synced with user ${userId}`);
    }
    catch (error) {
        logger_1.default.error(`Error parsing resume ${resumeId}: ${error.message}`);
        await prisma_1.prisma.resume.update({
            where: { id: resumeId },
            data: { status: 'failed', error: error.message }
        });
    }
});
//# sourceMappingURL=resume.worker.js.map