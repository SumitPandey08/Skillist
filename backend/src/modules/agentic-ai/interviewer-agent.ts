import { StateGraph, END } from "@langchain/langgraph";
import { AgentState, getModel } from "./base-agent";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const InterviewFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
});

const model = getModel(0.2).withStructuredOutput(InterviewFeedbackSchema);

async function analyzeInterview(state: typeof AgentState.State) {
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
    new SystemMessage("You are an expert technical interviewer."),
    new HumanMessage(prompt),
  ]);

  return { refinedRoadmap: result }; // Using refinedRoadmap as a generic slot or we could extend AgentState
}

const workflow = new StateGraph(AgentState)
  .addNode("analyzeInterview", analyzeInterview)
  .addEdge("__start__", "analyzeInterview")
  .addEdge("analyzeInterview", END);

export const interviewerAgent = workflow.compile();
