import { StateGraph, END } from "@langchain/langgraph";
import { AgentState, getStructuredModel } from "./base-agent";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const RefinedStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  notes: z.string(),
  prerequisites: z.array(z.string()),
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
});

const RefinedRoadmapSchema = z.object({
  steps: z.array(RefinedStepSchema),
});

const model = getStructuredModel(RefinedRoadmapSchema);

async function refineRoadmap(state: typeof AgentState.State) {
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
    new SystemMessage("You are an expert at detailed career planning."),
    new HumanMessage(prompt),
  ]);

  return { refinedRoadmap: result };
}

const workflow = new StateGraph(AgentState)
  .addNode("refineRoadmap", refineRoadmap)
  .addEdge("__start__", "refineRoadmap")
  .addEdge("refineRoadmap", END);

export const roadmapAgent = workflow.compile();
