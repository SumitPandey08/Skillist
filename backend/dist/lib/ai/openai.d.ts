import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
export declare const genAI: GoogleGenerativeAI;
export declare function getGeminiModel(model?: string): import("@google/generative-ai").GenerativeModel;
export declare function geminiGenerateContent(prompt: string, options?: {
    temperature?: number;
    responseMimeType?: string;
}): Promise<string>;
export declare function geminiGenerateJson<T>(prompt: string, schema: z.ZodType<any> | any, options?: {
    temperature?: number;
}): Promise<T>;
