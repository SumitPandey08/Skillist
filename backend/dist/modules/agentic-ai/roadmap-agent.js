"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roadmapAgent = void 0;
const langgraph_1 = require("@langchain/langgraph");
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const messages_1 = require("@langchain/core/messages");
const RefinedStepSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    notes: zod_1.z.string(),
    prerequisites: zod_1.z.array(zod_1.z.string()),
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
});
const RefinedRoadmapSchema = zod_1.z.object({
    steps: zod_1.z.array(RefinedStepSchema),
});
const model = (0, base_agent_1.getModel)().withStructuredOutput(RefinedRoadmapSchema);
async function refineRoadmap(state) {
    const prompt = `
    You are an expert career architect. 
    Refine the following roadmap for a student who wants to become a ${state.targetRole}.
    
    Current Skills: ${state.currentSkills.join(', ')}
    
    Current Roadmap Description: ${state.refinedRoadmap?.description || 'N/A'}
    Current Steps: ${JSON.stringify(state.refinedRoadmap?.steps || [])}
    
    Objective:
    - Enrich the resources with 2-3 specific, high-quality links and 2-3 specific YouTube videos for each step. Ensure URLs are real and high quality.
    - Identify accurate prerequisites for each step to ensure a smooth learning path.
    - Improve the "notes" section to be highly detailed and actionable.
    - Maintain the existing structure but enrich the content.
  `;
    const result = await model.invoke([
        new messages_1.SystemMessage("You are an expert at detailed career planning."),
        new messages_1.HumanMessage(prompt),
    ]);
    return { refinedRoadmap: result };
}
const workflow = new langgraph_1.StateGraph(base_agent_1.AgentState)
    .addNode("refineRoadmap", refineRoadmap)
    .addEdge("__start__", "refineRoadmap")
    .addEdge("refineRoadmap", langgraph_1.END);
exports.roadmapAgent = workflow.compile();
//# sourceMappingURL=roadmap-agent.js.map