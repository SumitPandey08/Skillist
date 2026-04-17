"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = exports.AgentState = void 0;
const google_genai_1 = require("@langchain/google-genai");
const langgraph_1 = require("@langchain/langgraph");
exports.AgentState = langgraph_1.Annotation.Root({
    messages: (0, langgraph_1.Annotation)({
        reducer: (x, y) => x.concat(y),
    }),
    roadmapId: (0, langgraph_1.Annotation)(),
    studentId: (0, langgraph_1.Annotation)(),
    targetRole: (0, langgraph_1.Annotation)(),
    currentSkills: (0, langgraph_1.Annotation)(),
    refinedRoadmap: (0, langgraph_1.Annotation)(),
});
const getModel = (temperature = 0) => {
    return new google_genai_1.ChatGoogleGenerativeAI({
        model: "gemini-flash-latest",
        temperature,
        apiKey: process.env.GEMINI_API_KEY
    });
};
exports.getModel = getModel;
//# sourceMappingURL=base-agent.js.map