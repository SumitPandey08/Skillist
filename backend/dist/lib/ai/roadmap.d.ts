import { z } from 'zod';
declare const RoadmapSchema: z.ZodObject<{
    description: z.ZodString;
    steps: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        notes: z.ZodString;
        prerequisites: z.ZodDefault<z.ZodArray<z.ZodString>>;
        resources: z.ZodObject<{
            videos: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                url: z.ZodString;
            }, z.core.$strip>>;
            links: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                url: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
        skill_name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type RoadmapAIResponse = z.infer<typeof RoadmapSchema>;
export declare function generateRoadmap(targetRole: string, currentSkills: string[]): Promise<RoadmapAIResponse>;
export {};
