import { StateGraph, END } from "@langchain/langgraph";
import { AgentState, getStructuredModel } from "./base-agent";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const SkillAnalysisSchema = z.object({
  topSkills: z.array(z.object({
    name: z.string(),
    score: z.number(),
    reason: z.string()
  })),
  gapAnalysis: z.array(z.object({
    skill: z.string(),
    gap: z.string(),
    recommendation: z.string()
  })),
  marketFit: z.number().min(0).max(100),
  suggestedRoles: z.array(z.string())
});

const model = getStructuredModel(SkillAnalysisSchema, 0);

async function analyzeSkills(state: typeof AgentState.State) {
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
    new SystemMessage("You are a senior technical recruiter and talent analyst."),
    new HumanMessage(prompt),
  ]);

  return { refinedRoadmap: result }; // Using refinedRoadmap as a generic slot
}

const workflow = new StateGraph(AgentState)
  .addNode("analyzeSkills", analyzeSkills)
  .addEdge("__start__", "analyzeSkills")
  .addEdge("analyzeSkills", END);

export const skillAnalysisAgent = workflow.compile();
