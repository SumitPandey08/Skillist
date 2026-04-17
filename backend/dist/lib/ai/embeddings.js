"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
const generative_ai_1 = require("@google/generative-ai");
async function generateEmbedding(text) {
    const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-001" });
    const result = await model.embedContent(text.replace(/\n/g, " "));
    return result.embedding.values;
}
//# sourceMappingURL=embeddings.js.map