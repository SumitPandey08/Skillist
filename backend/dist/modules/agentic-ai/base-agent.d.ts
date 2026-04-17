import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
export declare const AgentState: import("@langchain/langgraph").AnnotationRoot<{
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<any[], any[]>;
    roadmapId: import("@langchain/langgraph").LastValue<string>;
    studentId: import("@langchain/langgraph").LastValue<string>;
    targetRole: import("@langchain/langgraph").LastValue<string>;
    currentSkills: import("@langchain/langgraph").LastValue<string[]>;
    refinedRoadmap: import("@langchain/langgraph").LastValue<any>;
}>;
export declare const getModel: (temperature?: number) => ChatGoogleGenerativeAI;
