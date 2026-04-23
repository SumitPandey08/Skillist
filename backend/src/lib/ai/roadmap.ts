import { getStructuredModel } from '../../modules/agentic-ai/base-agent';
import { z } from 'zod';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const RoadmapStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  notes: z.string(),
  prerequisites: z.array(z.string()).default([]),
  resources: z.object({
    videos: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })),
    links: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })),
  }),
  skill_name: z.string().optional(),
});

const RoadmapSchema = z.object({
  description: z.string(),
  steps: z.array(RoadmapStepSchema).min(4).max(12),
});

export type RoadmapAIResponse = z.infer<typeof RoadmapSchema>;

export async function generateRoadmap(
  targetRole: string,
  currentSkills: string[]
): Promise<RoadmapAIResponse> {
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

  const structuredModel = getStructuredModel(RoadmapSchema, 0.7);
  const result = await structuredModel.invoke([
    new SystemMessage("You are an expert career architect."),
    new HumanMessage(prompt)
  ]);
  
  return result as RoadmapAIResponse;
}
