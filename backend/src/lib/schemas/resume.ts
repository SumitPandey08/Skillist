import { z } from 'zod'

export const ResumeExtractionSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced']),
  })),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    description: z.string(),
    startDate: z.string().describe('ISO date or month/year'),
    endDate: z.string().optional().describe('ISO date or month/year or "Present"'),
  })),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string().optional(),
    field: z.string().optional(),
    graduationDate: z.string().optional().describe('ISO date or month/year'),
  })),
})

export type ResumeExtraction = z.infer<typeof ResumeExtractionSchema>
