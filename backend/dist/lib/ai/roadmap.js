"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoadmap = generateRoadmap;
const openai_1 = require("./openai");
const zod_1 = require("zod");
const RoadmapStepSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    notes: zod_1.z.string(),
    prerequisites: zod_1.z.array(zod_1.z.string()).default([]),
    resources: zod_1.z.object({
        videos: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string(),
            url: zod_1.z.string(),
        })),
        links: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string(),
            url: zod_1.z.string(),
        })),
    }),
    skill_name: zod_1.z.string().optional(),
});
const RoadmapSchema = zod_1.z.object({
    description: zod_1.z.string(),
    steps: zod_1.z.array(RoadmapStepSchema).min(4).max(12),
});
async function generateRoadmap(targetRole, currentSkills) {
    const prompt = `
    You are an expert career coach and senior technical architect. 
    Generate a professional, comprehensive learning roadmap for a student who wants to become a ${targetRole}.
    
    Current Skills: ${currentSkills.length > 0 ? currentSkills.join(', ') : 'None listed yet.'}
    
    Rules:
    1. Focus on bridging the gap between current skills and the target role. Build a logical progression.
    2. Provide 5-10 highly actionable, sequential steps.
    3. Each step must have:
       - title: Clear, concise name of the concept or technology.
       - description: High-level overview of why this matters for the role.
       - notes: Detailed markdown notes covering core concepts, architectural patterns, and what specifically to learn.
       - prerequisites: Array of prerequisite concepts or skills needed before starting this step.
       - resources: Highly curated, specific resources.
         - videos: Provide real, high-quality YouTube video URLs (e.g., from traversy media, fireship, freecodecamp, specific conference talks). Do NOT use search URLs.
         - links: Provide links to official documentation, high-quality articles, or interactive tutorials (e.g., MDN, React Docs, roadmap.sh, etc).
       - skill_name: If it relates to a specific technical skill (e.g., 'React', 'Node.js', 'System Design').
    
    Output must be structured JSON. Ensure the roadmap is world-class, surpassing generic advice.
  `;
    const result = await (0, openai_1.geminiGenerateJson)(prompt, RoadmapSchema, { temperature: 0.7 });
    return result;
}
//# sourceMappingURL=roadmap.js.map