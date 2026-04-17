import { z } from 'zod';
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
declare const EvaluationSchema: z.ZodObject<{
    score: z.ZodNumber;
    feedback: z.ZodString;
    technicalScore: z.ZodNumber;
    communicationScore: z.ZodNumber;
    behavioralScore: z.ZodNumber;
    strengths: z.ZodArray<z.ZodString>;
    improvements: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type InterviewEvaluation = z.infer<typeof EvaluationSchema>;
export declare function getNextInterviewQuestion(role: string, history: ChatMessage[]): Promise<string>;
export declare function analyzeInterviewPerformance(role: string, history: ChatMessage[]): Promise<InterviewEvaluation>;
export declare function evaluateMockInterview(studentId: string, role: string, question: string, answer: string): Promise<{
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    status: string;
    score: number | null;
    feedback: string | null;
}>;
export {};
