import { StateGraph, END } from "@langchain/langgraph";
import { AgentState, getStructuredModel } from "./base-agent";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const MCQSchema = z.object({
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
    correctOptionIndex: z.number().min(0).max(3),
    explanation: z.string()
  }))
});

const model = getStructuredModel(MCQSchema, 0.2);

async function generateMCQs(state: typeof AgentState.State) {
  const skill = state.currentSkills[0]; // For assessment, we test one skill at a time

  const prompt = `
    You are an expert IT technical interviewer. 
    Generate 10 multiple-choice questions to assess proficiency in: ${skill}.
    
    Requirements:
    - Mix of difficulty: 3 Easy, 4 Medium, 3 Hard.
    - Each question must have exactly 4 options.
    - Provide a brief explanation for the correct answer.
    - Ensure questions are modern and relevant to industry standards.
  `;

  const result = await model.invoke([
    new SystemMessage("You are a senior software architect and technical educator."),
    new HumanMessage(prompt),
  ]);

  return { refinedRoadmap: result };
}

const workflow = new StateGraph(AgentState)
  .addNode("generateMCQs", generateMCQs)
  .addEdge("__start__", "generateMCQs")
  .addEdge("generateMCQs", END);

export const assessmentAgent = workflow.compile();
