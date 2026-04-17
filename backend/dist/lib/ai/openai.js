"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAI = void 0;
exports.getGeminiModel = getGeminiModel;
exports.geminiGenerateContent = geminiGenerateContent;
exports.geminiGenerateJson = geminiGenerateJson;
const generative_ai_1 = require("@google/generative-ai");
const zod_to_json_schema_1 = require("zod-to-json-schema");
if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY');
}
exports.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
function getGeminiModel(model = 'gemini-flash-latest') {
    return exports.genAI.getGenerativeModel({ model });
}
async function geminiGenerateContent(prompt, options = {}) {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
}
/**
 * Recursively removes unsupported fields from JSON schema for Gemini API
 */
function cleanSchema(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(cleanSchema);
    }
    const cleaned = {};
    for (const key in obj) {
        if (['$schema', 'definitions', '$defs', 'additionalProperties'].includes(key)) {
            continue;
        }
        cleaned[key] = cleanSchema(obj[key]);
    }
    return cleaned;
}
async function geminiGenerateJson(prompt, schema, options = {}) {
    const model = getGeminiModel();
    // Convert Zod schema to JSON schema if needed
    let jsonSchema;
    if (schema && typeof schema.toJSONSchema === 'function') {
        // New Zod (v4+) might have built-in toJSONSchema
        jsonSchema = schema.toJSONSchema();
    }
    else if (schema && schema._def) {
        // Standard Zod v3
        jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(schema, { $refStrategy: 'none' });
    }
    else {
        jsonSchema = schema;
    }
    // Deep clean the schema
    jsonSchema = cleanSchema(jsonSchema);
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: options.temperature ?? 0,
            responseMimeType: 'application/json',
            responseSchema: jsonSchema,
        },
    });
    const text = result.response.text();
    return JSON.parse(text);
}
//# sourceMappingURL=openai.js.map