import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { zodToJsonSchema } from "zod-to-json-schema";

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

/**
 * Recursively removes unsupported fields from JSON schema for Gemini API
 */
export function cleanSchema(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanSchema);
  }

  const cleaned: any = {};
  let hasProps = false;
  for (const key in obj) {
    if (['$schema', 'definitions', '$defs', 'additionalProperties', 'default'].includes(key)) {
      continue;
    }
    cleaned[key] = cleanSchema(obj[key]);
    hasProps = true;
  }
  return hasProps ? cleaned : obj;
}

export const getModel = (temperature = 0) => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    temperature,
    apiKey: process.env.GEMINI_API_KEY
  });
};

export const getStructuredModel = (schema: any, temperature = 0) => {
  const model = getModel(temperature);
  
  let jsonSchema: any;
  if (schema && typeof (schema as any).toJSONSchema === 'function') {
    jsonSchema = (schema as any).toJSONSchema();
  } else if (schema && (schema as any)._def) {
    // If it's a Zod schema but no toJSONSchema (unlikely in Zod 4), or if we want to be safe
    try {
      jsonSchema = zodToJsonSchema(schema as any, { $refStrategy: 'none' });
      // If zod-to-json-schema returned just the $schema (known issue with some versions/configs)
      if (Object.keys(jsonSchema).length === 1 && jsonSchema.$schema) {
         // Fallback to the schema object itself if conversion failed to produce properties
         jsonSchema = schema;
      }
    } catch (e) {
      jsonSchema = schema;
    }
  } else {
    jsonSchema = schema;
  }

  const cleaned = cleanSchema(jsonSchema);
  
  // Gemini withStructuredOutput expects the schema directly or a Zod object.
  // Passing { name, schema } is for OpenAI-style function calling which Gemini might reject in this context.
  return model.withStructuredOutput(cleaned);
};
