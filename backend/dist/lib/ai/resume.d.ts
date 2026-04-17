import { z } from "zod";
declare const ResumeSchema: z.ZodObject<{
    personalInfo: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        linkedIn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        github: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        portfolio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
    professionalSummary: z.ZodString;
    skills: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        proficiency: z.ZodString;
        category: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    experience: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        company: z.ZodString;
        location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        description: z.ZodString;
        startDate: z.ZodString;
        endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isCurrentRole: z.ZodBoolean;
        achievements: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    education: z.ZodArray<z.ZodObject<{
        school: z.ZodString;
        degree: z.ZodString;
        field: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        graduationDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        gpa: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    projects: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        technologies: z.ZodArray<z.ZodString>;
        url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        startDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    certifications: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        issuer: z.ZodString;
        date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        credentialId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    languages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        proficiency: z.ZodString;
    }, z.core.$strip>>>;
    atsScore: z.ZodOptional<z.ZodNumber>;
    keywordMatches: z.ZodOptional<z.ZodArray<z.ZodString>>;
    suggestions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type ResumeData = z.infer<typeof ResumeSchema>;
type ModelProvider = 'gemini-pro' | 'gemini-flash' | 'gpt-4' | 'gpt-4-turbo' | 'claude-3.5';
export declare function generateResume(params: {
    student: any;
    targetRole: string;
    modelProvider?: ModelProvider;
    industry?: string;
    currentResume?: ResumeData;
    regenerateSection?: string;
}): Promise<ResumeData>;
export declare function tailorResumeData(params: {
    studentProfile: any;
    experience: any[];
    projects: any[];
    jobDescription: string;
}): Promise<ResumeData>;
export type { ResumeData };
export { ResumeSchema };
