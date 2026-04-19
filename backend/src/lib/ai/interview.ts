import { getGeminiModel, geminiGenerateContent, geminiGenerateJson } from './openai';
import { z } from 'zod';
import { prisma } from '../prisma';
import { nanoid } from 'nanoid';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const EvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  technicalScore: z.number().min(0).max(10),
  communicationScore: z.number().min(0).max(10),
  behavioralScore: z.number().min(0).max(10),
  problemSolvingScore: z.number().min(0).max(10),
  roleSpecificScore: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  detailedBreakdown: z.object({
    technical: z.string(),
    communication: z.string(),
    behavioral: z.string(),
  }),
});

export type InterviewEvaluation = z.infer<typeof EvaluationSchema>;

const InterviewQASchema = z.object({
  question: z.string(),
});

export async function getNextInterviewQuestion(
  role: string,
  history: ChatMessage[]
): Promise<string> {
  const systemPrompt = `
    You are an expert technical recruiter and architect. You are conducting a mock interview for the position of ${role}.
    
    Your goal is to provide a realistic, challenging, yet supportive interview experience.
    
    Personality:
    - Professional, slightly formal, but encouraging.
    - Insightful: You ask deep "why" and "how" questions, not just trivia.
    - Adaptive: If the candidate gives a great answer, push them harder. If they struggle, guide them slightly or move to a related topic.
    
    Structure:
    1. Introduction: If history is empty, welcome them and ask for a 2-minute elevator pitch.
    2. Deep Dive: Ask 3-4 progressive technical questions. Start with fundamentals and move to architectural or complex scenarios specific to ${role}.
    3. Behavioral/Scenario: Ask 1-2 questions about their process, conflict resolution, or project management (e.g., "Tell me about a time you had to make a difficult technical trade-off").
    4. Closing: After ~8 total turns, thank them and mention that feedback will be generated shortly.
    
    Rules:
    - ONLY ONE QUESTION at a time.
    - Do not repeat questions already asked in the history.
    - If the candidate's last answer was short, ask a specific follow-up.
    - STAY IN CHARACTER. Do not mention you are an AI.
  `;

  const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  const prompt = `${systemPrompt}\n\nConversation History:\n${historyText}\n\nBased on the history, generate the next logical and most impactful interview question. Return JSON with a "question" field.`;

  const result = await geminiGenerateJson<{ question: string }>(prompt, InterviewQASchema, { temperature: 0.8 });
  return result.question || "That's interesting. Could you expand on how you'd handle that in a production environment?";
}

export async function analyzeInterviewPerformance(
  role: string,
  history: ChatMessage[]
): Promise<InterviewEvaluation> {
  const prompt = `
    You are an expert technical interviewer. Analyze the following mock interview transcript for the position of ${role}.
    
    Conversation History:
    ${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
    
    Evaluate the candidate across these categories:
    1. Technical Competence (0-10): Knowledge of ${role} core concepts, tools, and best practices.
    2. Communication Clarity (0-10): Ability to explain complex ideas, structured thinking, and active listening.
    3. Behavioral Fit (0-10): Cultural alignment, problem-solving mindset, and handling of situation-based questions.
    4. Problem Solving (0-10): Analytical approach, edge-case consideration, and efficiency of proposed solutions.
    5. Role-Specific Proficiency (0-10): Mastery of industry-standard requirements for a ${role}.
    
    Provide:
    - Overall score (0-100)
    - High-level feedback summary
    - 3-5 specific strengths
    - 3-5 specific improvements
    - Detailed breakdown for Technical, Communication, and Behavioral aspects.
    
    Return the response as a valid JSON object matching this schema:
    {
      "score": number,
      "feedback": string,
      "technicalScore": number,
      "communicationScore": number,
      "behavioralScore": number,
      "problemSolvingScore": number,
      "roleSpecificScore": number,
      "strengths": string[],
      "improvements": string[],
      "detailedBreakdown": {
        "technical": string,
        "communication": string,
        "behavioral": string
      }
    }
  `;

  const result = await geminiGenerateJson<InterviewEvaluation>(prompt, EvaluationSchema, { temperature: 0 });
  return result;
}

export async function evaluateMockInterview(
  studentId: string,
  role: string,
  question: string,
  answer: string
) {
  const prompt = `
    You are an expert technical interviewer evaluating a candidate for the role of ${role}.
    
    QUESTION: ${question}
    CANDIDATE ANSWER: ${answer}
    
    Score their answer out of 100 and provide constructive feedback.
    
    Output must be structured JSON with:
    - score (number)
    - feedback (string)
  `;

  const result = await geminiGenerateJson<{ score: number; feedback: string }>(
    prompt,
    z.object({ score: z.number(), feedback: z.string() }),
    { temperature: 0 }
  );

  const mockInterview = await prisma.mockInterview.create({
    data: {
      id: nanoid(),
      studentId,
      role,
      score: result.score,
      feedback: result.feedback,
      status: 'completed'
    }
  });

  return mockInterview;
}
