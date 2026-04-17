"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewerAgent = void 0;
const langgraph_1 = require("@langchain/langgraph");
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const messages_1 = require("@langchain/core/messages");
const InterviewFeedbackSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(100),
    feedback: zod_1.z.string(),
    strengths: zod_1.z.array(zod_1.z.string()),
    weaknesses: zod_1.z.array(zod_1.z.string()),
    suggestions: zod_1.z.array(zod_1.z.string()),
});
const model = (0, base_agent_1.getModel)(0.2).withStructuredOutput(InterviewFeedbackSchema);
async function analyzeInterview(state) {
    const messages = state.messages;
    const role = state.targetRole;
    const prompt = `
    You are an expert technical interviewer for the role of ${role}.
    Analyze the following interview transcript between an Interviewer and a Candidate.
    
    Transcript:
    ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
    
    Objective:
    - Provide a score from 0-100 based on technical accuracy, communication, and problem-solving.
    - Give constructive feedback.
    - List specific strengths and weaknesses.
    - Suggest areas for improvement.
  `;
    const result = await model.invoke([
        new messages_1.SystemMessage("You are an expert technical interviewer."),
        new messages_1.HumanMessage(prompt),
    ]);
    return { refinedRoadmap: result }; // Using refinedRoadmap as a generic slot or we could extend AgentState
}
const workflow = new langgraph_1.StateGraph(base_agent_1.AgentState)
    .addNode("analyzeInterview", analyzeInterview)
    .addEdge("__start__", "analyzeInterview")
    .addEdge("analyzeInterview", langgraph_1.END);
exports.interviewerAgent = workflow.compile();
//# sourceMappingURL=interviewer-agent.js.map