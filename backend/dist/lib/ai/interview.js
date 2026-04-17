"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextInterviewQuestion = getNextInterviewQuestion;
exports.analyzeInterviewPerformance = analyzeInterviewPerformance;
exports.evaluateMockInterview = evaluateMockInterview;
const openai_1 = require("./openai");
const zod_1 = require("zod");
const prisma_1 = require("../prisma");
const nanoid_1 = require("nanoid");
const EvaluationSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(100),
    feedback: zod_1.z.string(),
    technicalScore: zod_1.z.number().min(0).max(10),
    communicationScore: zod_1.z.number().min(0).max(10),
    behavioralScore: zod_1.z.number().min(0).max(10),
    strengths: zod_1.z.array(zod_1.z.string()),
    improvements: zod_1.z.array(zod_1.z.string()),
});
const InterviewQASchema = zod_1.z.object({
    question: zod_1.z.string(),
});
async function getNextInterviewQuestion(role, history) {
    const systemPrompt = `
    You are an expert technical recruiter and architect. You are conducting a mock interview for the position of ${role}.
    
    Your goal is to provide a realistic, challenging, yet supportive interview experience.
    
    Structure:
    1. If the history is empty, start with a professional welcome and ask the candidate to introduce themselves.
    2. If the candidate has introduced themselves, move to 2-3 technical questions relevant to ${role}.
    3. If technical questions are covered, move to 1-2 behavioral questions (e.g., "Tell me about a time when...").
    4. If the interview is nearing the end (around 5-6 turns), provide a brief closing.
    
    Rules:
    - Be concise. One question at a time.
    - Ask follow-up questions if an answer is too brief or lacks depth.
    - Stay in character as a professional interviewer.
    - Do not provide feedback during the interview; wait for the final analysis.
  `;
    const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const prompt = `${systemPrompt}\n\nConversation History:\n${historyText}\n\nGenerate the next interview question. Return JSON with "question" field.`;
    const result = await (0, openai_1.geminiGenerateJson)(prompt, InterviewQASchema, { temperature: 0.7 });
    return result.question || "Could you please elaborate on that?";
}
async function analyzeInterviewPerformance(role, history) {
    const prompt = `
    You are an expert technical interviewer. Analyze the following mock interview transcript for the position of ${role}.
    
    Conversation History:
    ${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
    
    Evaluate the candidate across:
    1. Technical Competence (0-10)
    2. Communication Clarity (0-10)
    3. Behavioral Fit (0-10)
    
    Provide a final score (0-100) and specific, constructive feedback.
    Identify 3 strengths and 3 areas for improvement.
    
    Output must be structured JSON.
  `;
    const result = await (0, openai_1.geminiGenerateJson)(prompt, EvaluationSchema, { temperature: 0 });
    return result;
}
async function evaluateMockInterview(studentId, role, question, answer) {
    const prompt = `
    You are an expert technical interviewer evaluating a candidate for the role of ${role}.
    
    QUESTION: ${question}
    CANDIDATE ANSWER: ${answer}
    
    Score their answer out of 100 and provide constructive feedback.
    
    Output must be structured JSON with:
    - score (number)
    - feedback (string)
  `;
    const result = await (0, openai_1.geminiGenerateJson)(prompt, zod_1.z.object({ score: zod_1.z.number(), feedback: zod_1.z.string() }), { temperature: 0 });
    const mockInterview = await prisma_1.prisma.mockInterview.create({
        data: {
            id: (0, nanoid_1.nanoid)(),
            studentId,
            role,
            score: result.score,
            feedback: result.feedback,
            status: 'completed'
        }
    });
    return mockInterview;
}
//# sourceMappingURL=interview.js.map