import { GoogleGenerativeAI } from '@google/generative-ai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY');
}

console.log(`[AI] GEMINI_API_KEY present, length: ${process.env.GEMINI_API_KEY.length}`);
if (process.env.GEMINI_API_KEY.length < 20) {
  console.warn('[AI] GEMINI_API_KEY seems suspiciously short');
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function getGeminiModel(model: string = 'gemini-flash-latest') {
  return genAI.getGenerativeModel({ model });
}

export async function geminiGenerateContent(
  prompt: string,
  options: { temperature?: number; responseMimeType?: string } = {}
) {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Recursively removes unsupported fields from JSON schema for Gemini API
 */
export function cleanSchema(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanSchema);
  }

  const cleaned: any = {};
  for (const key in obj) {
    if (['$schema', 'definitions', '$defs', 'additionalProperties', 'default'].includes(key)) {
      continue;
    }
    cleaned[key] = cleanSchema(obj[key]);
  }
  return cleaned;
}

export async function geminiGenerateJson<T>(
  prompt: string,
  schema: z.ZodType<any> | any,
  options: { temperature?: number } = {}
): Promise<T> {
  const model = getGeminiModel();
  
  // Convert Zod schema to JSON schema if needed
  let jsonSchema: any;
  if (schema && typeof (schema as any).toJSONSchema === 'function') {
    // New Zod (v4+) might have built-in toJSONSchema
    jsonSchema = (schema as any).toJSONSchema();
  } else if (schema && (schema as any)._def) {
    // Standard Zod v3
    jsonSchema = zodToJsonSchema(schema as any, { $refStrategy: 'none' });
  } else {
    jsonSchema = schema;
  }

  // Deep clean the schema
  jsonSchema = cleanSchema(jsonSchema);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0,
      responseMimeType: 'application/json',
      responseSchema: jsonSchema as any,
    },
  });
  const text = result.response.text();
  return JSON.parse(text) as T;
}
