import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  messages: Annotation<any[]>({
    reducer: (x, y) => x.concat(y),
  }),
  roadmapId: Annotation<string>(),
  studentId: Annotation<string>(),
  targetRole: Annotation<string>(),
  currentSkills: Annotation<string[]>(),
  refinedRoadmap: Annotation<any>(),
});

export const getModel = (temperature = 0) => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    temperature,
    apiKey: process.env.GEMINI_API_KEY
  });
};
