export declare const roadmapAgent: import("@langchain/langgraph").CompiledStateGraph<import("@langchain/langgraph").StateType<{
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<any[], any[]>;
    roadmapId: import("@langchain/langgraph").LastValue<string>;
    studentId: import("@langchain/langgraph").LastValue<string>;
    targetRole: import("@langchain/langgraph").LastValue<string>;
    currentSkills: import("@langchain/langgraph").LastValue<string[]>;
    refinedRoadmap: import("@langchain/langgraph").LastValue<any>;
}>, import("@langchain/langgraph").UpdateType<{
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<any[], any[]>;
    roadmapId: import("@langchain/langgraph").LastValue<string>;
    studentId: import("@langchain/langgraph").LastValue<string>;
    targetRole: import("@langchain/langgraph").LastValue<string>;
    currentSkills: import("@langchain/langgraph").LastValue<string[]>;
    refinedRoadmap: import("@langchain/langgraph").LastValue<any>;
}>, "__start__" | "refineRoadmap", {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<any[], any[]>;
    roadmapId: import("@langchain/langgraph").LastValue<string>;
    studentId: import("@langchain/langgraph").LastValue<string>;
    targetRole: import("@langchain/langgraph").LastValue<string>;
    currentSkills: import("@langchain/langgraph").LastValue<string[]>;
    refinedRoadmap: import("@langchain/langgraph").LastValue<any>;
}, {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<any[], any[]>;
    roadmapId: import("@langchain/langgraph").LastValue<string>;
    studentId: import("@langchain/langgraph").LastValue<string>;
    targetRole: import("@langchain/langgraph").LastValue<string>;
    currentSkills: import("@langchain/langgraph").LastValue<string[]>;
    refinedRoadmap: import("@langchain/langgraph").LastValue<any>;
}, import("@langchain/langgraph").StateDefinition>;
