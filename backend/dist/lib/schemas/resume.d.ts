import { z } from 'zod';
export declare const ResumeExtractionSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        proficiency: z.ZodEnum<{
            intermediate: "intermediate";
            beginner: "beginner";
            advanced: "advanced";
        }>;
    }, z.core.$strip>>;
    experience: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        company: z.ZodString;
        location: z.ZodOptional<z.ZodString>;
        description: z.ZodString;
        startDate: z.ZodString;
        endDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    education: z.ZodArray<z.ZodObject<{
        school: z.ZodString;
        degree: z.ZodOptional<z.ZodString>;
        field: z.ZodOptional<z.ZodString>;
        graduationDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ResumeExtraction = z.infer<typeof ResumeExtractionSchema>;
