"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeExtractionSchema = void 0;
const zod_1 = require("zod");
exports.ResumeExtractionSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        proficiency: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
    })),
    experience: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        company: zod_1.z.string(),
        location: zod_1.z.string().optional(),
        description: zod_1.z.string(),
        startDate: zod_1.z.string().describe('ISO date or month/year'),
        endDate: zod_1.z.string().optional().describe('ISO date or month/year or "Present"'),
    })),
    education: zod_1.z.array(zod_1.z.object({
        school: zod_1.z.string(),
        degree: zod_1.z.string().optional(),
        field: zod_1.z.string().optional(),
        graduationDate: zod_1.z.string().optional().describe('ISO date or month/year'),
    })),
});
//# sourceMappingURL=resume.js.map