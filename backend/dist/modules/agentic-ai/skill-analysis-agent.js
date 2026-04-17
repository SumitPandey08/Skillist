"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillAnalysisAgent = void 0;
const langgraph_1 = require("@langchain/langgraph");
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const messages_1 = require("@langchain/core/messages");
const SkillAnalysisSchema = zod_1.z.object({
    topSkills: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        score: zod_1.z.number(),
        reason: zod_1.z.string()
    })),
    gapAnalysis: zod_1.z.array(zod_1.z.object({
        skill: zod_1.z.string(),
        gap: zod_1.z.string(),
        recommendation: zod_1.z.string()
    })),
    marketFit: zod_1.z.number().min(0).max(100),
    suggestedRoles: zod_1.z.array(zod_1.z.string())
});
const model = (0, base_agent_1.getModel)(0).withStructuredOutput(SkillAnalysisSchema);
async function analyzeSkills(state) {
    const skills = state.currentSkills;
    const targetRole = state.targetRole;
    const prompt = `
    You are an AI talent analyst. 
    Analyze the skills for a student aiming for the role: ${targetRole}.
    
    Current Skills: ${skills.join(', ')}
    
    Objective:
    - Identify top strengths based on the target role.
    - Perform a gap analysis: what is missing for a ${targetRole} role?
    - Calculate a 'Market Fit' score from 0-100.
    - Suggest alternative career paths/roles based on current skills.
  `;
    const result = await model.invoke([
        new messages_1.SystemMessage("You are a senior technical recruiter and talent analyst."),
        new messages_1.HumanMessage(prompt),
    ]);
    return { refinedRoadmap: result }; // Using refinedRoadmap as a generic slot
}
const workflow = new langgraph_1.StateGraph(base_agent_1.AgentState)
    .addNode("analyzeSkills", analyzeSkills)
    .addEdge("__start__", "analyzeSkills")
    .addEdge("analyzeSkills", langgraph_1.END);
exports.skillAnalysisAgent = workflow.compile();
//# sourceMappingURL=skill-analysis-agent.js.map