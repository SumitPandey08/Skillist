"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractResumeData = extractResumeData;
const openai_1 = require("./openai");
const resume_1 = require("../schemas/resume");
async function extractResumeData(text) {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) parser. Extract structured data from the following resume text. Be precise and thorough with skills extraction.
    
    Resume Text:
    ${text}
    
    Return structured JSON matching the schema.
  `;
    const result = await (0, openai_1.geminiGenerateJson)(prompt, resume_1.ResumeExtractionSchema, { temperature: 0 });
    return result;
}
//# sourceMappingURL=parser.js.map