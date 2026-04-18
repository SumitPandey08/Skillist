import { StateGraph, END } from "@langchain/langgraph";
import { AgentState, getModel } from "./base-agent";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const CareerQuestionSchema = z.object({
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    options: z.array(z.string()),
  }))
});

const CareerRecommendationSchema = z.object({
  suggestedRoles: z.array(z.string()),
  gapAnalysis: z.array(z.object({
    skill: z.string(),
    gap: z.string(),
    recommendation: z.string()
  })),
  actionPlan: z.array(z.object({
    step: z.string(),
    priority: z.enum(["High", "Medium", "Low"]),
    resource: z.string()
  }))
});

const questionModel = getModel(0.5).withStructuredOutput(CareerQuestionSchema);
const recommendationModel = getModel(0.2).withStructuredOutput(CareerRecommendationSchema);

async function generateCareerQuestions(state: typeof AgentState.State) {
  const currentSkills = state.currentSkills || [];
  
  const prompt = `
    Generate 5 behavioral and preference questions to help a student choose the right career path in IT.
    The student currently has these skills: ${currentSkills.join(', ')}.
    
    Focus on:
    - Problem-solving style (Individual vs Team).
    - Interest in visual design vs logic/systems.
    - Interest in leadership vs deep technical mastery.
    - Stability vs Startup-style fast-paced environments.
    
    Each question should have 3-4 options representing different archetypes.
  `;

  const result = await questionModel.invoke([
    new SystemMessage("You are a senior career coach in the tech industry."),
    new HumanMessage(prompt),
  ]);

  return { refinedRoadmap: result };
}

async function synthesizeRecommendation(state: typeof AgentState.State) {
  const messages = state.messages || [];
  const assessmentSummary = messages.find(m => m.type === 'assessment')?.content || "No assessment data available.";
  const behavioralAnswers = messages.find(m => m.type === 'behavioral')?.content || "No behavioral data available.";

  const prompt = `
    As an AI Career Strategist, synthesize a recommendation for a student based on:
    
    1. Technical Assessment Result: ${assessmentSummary}
    2. Behavioral/Preference Answers: ${behavioralAnswers}
    
    Output:
    - 3 Suggested Career Roles.
    - Detailed Gap Analysis for those roles.
    - A 5-step Action Plan with priorities and suggested resources (e.g., documentation, courses).
  `;

  const result = await recommendationModel.invoke([
    new SystemMessage("You are an expert Tech Career Strategist."),
    new HumanMessage(prompt),
  ]);

  return { refinedRoadmap: result };
}

const questionWorkflow = new StateGraph(AgentState)
  .addNode("generateQuestions", generateCareerQuestions)
  .addEdge("__start__", "generateQuestions")
  .addEdge("generateQuestions", END);

const recommendationWorkflow = new StateGraph(AgentState)
  .addNode("synthesize", synthesizeRecommendation)
  .addEdge("__start__", "synthesize")
  .addEdge("synthesize", END);

export const careerQuestionAgent = questionWorkflow.compile();
export const careerRecommendationAgent = recommendationWorkflow.compile();
