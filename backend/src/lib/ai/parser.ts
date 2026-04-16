import { getGeminiModel, geminiGenerateJson } from './openai';
import { ResumeExtractionSchema, type ResumeExtraction } from '../schemas/resume';

export async function extractResumeData(text: string): Promise<ResumeExtraction> {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) parser. Extract structured data from the following resume text. Be precise and thorough with skills extraction.
    
    Resume Text:
    ${text}
    
    Return structured JSON matching the schema.
  `;

  const result = await geminiGenerateJson<ResumeExtraction>(prompt, ResumeExtractionSchema, { temperature: 0 });
  return result;
}
