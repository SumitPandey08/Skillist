import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Enhanced Zod schema for structured output
const ResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    linkedIn: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    portfolio: z.string().optional().nullable(),
  }),
  professionalSummary: z.string().min(50, "Summary must be at least 50 characters"),
  skills: z.array(z.object({
    name: z.string(),
    proficiency: z.string(),
    category: z.string().optional(),
  })),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional().nullable(),
    description: z.string(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    isCurrentRole: z.boolean(),
    achievements: z.array(z.string()).optional(),
  })),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string().optional().nullable(),
    graduationDate: z.string().optional().nullable(),
    gpa: z.string().optional().nullable(),
  })),
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    url: z.string().optional().nullable(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string().optional().nullable(),
    credentialId: z.string().optional().nullable(),
  })),
  languages: z.array(z.object({
    language: z.string(),
    proficiency: z.string(),
  })).optional(),
  atsScore: z.number().min(0).max(100).optional(),
  keywordMatches: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
});

type ResumeData = z.infer<typeof ResumeSchema>;

// Model configuration
type ModelProvider = 'gemini-pro' | 'gemini-flash' | 'gpt-4' | 'gpt-4-turbo' | 'claude-3.5';

interface ModelConfig {
  provider: ModelProvider;
  temperature: number;
  maxTokens: number;
}

const getModel = (config: ModelConfig) => {
  const { provider, temperature, maxTokens } = config;

  switch (provider) {
    case 'gemini-pro':
      return new ChatGoogleGenerativeAI({
        model: "gemini-2.5-pro-preview-05-06",
        temperature,
        maxOutputTokens: maxTokens,
        apiKey: process.env.GEMINI_API_KEY,
      });
    case 'gemini-flash':
      return new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature,
        maxOutputTokens: maxTokens,
        apiKey: process.env.GEMINI_API_KEY,
      });
    case 'gpt-4':
      return new ChatOpenAI({
        modelName: "gpt-4-turbo-preview",
        temperature,
        maxTokens,
        apiKey: process.env.OPENAI_API_KEY,
      });
    case 'gpt-4-turbo':
      return new ChatOpenAI({
        modelName: "gpt-4",
        temperature,
        maxTokens,
        apiKey: process.env.OPENAI_API_KEY,
      });
    default:
      return new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature,
        maxOutputTokens: maxTokens,
        apiKey: process.env.GEMINI_API_KEY,
      });
  }
};

const buildSystemPrompt = (targetRole: string, industry: string = 'technology') => {
  return `You are an expert resume writer and career coach with 15+ years of experience helping professionals land jobs at top companies including FAANG and Fortune 500 companies.

INSTRUCTIONS:
1. Create a compelling, ATS-optimized resume tailored for the target role: "${targetRole}" in the ${industry} industry
2. Use powerful action verbs and quantifiable achievements
3. Optimize for both ATS (Applicant Tracking Systems) and human recruiters
4. Include relevant keywords from modern job descriptions
5. Keep content concise, professional, and achievement-oriented
6. Use STAR format (Situation, Task, Action, Result) for experience descriptions where possible
7. For each achievement, include metrics (percentages, dollar amounts, time saved, etc.)
8. Structure skills by relevance to the target role

FORMAT REQUIREMENTS:
- Professional Summary: 3-4 powerful sentences highlighting value proposition
- Experience: Focus on achievements, not just responsibilities
- Projects: Emphasize impact, technologies used, and outcomes
- Skills: Categorize logically, include proficiency levels

KEYWORDS TO EMPHASIZE (based on role):
- For Technical roles: "collaboration", "problem-solving", "innovation", "scalable", "Agile", "CI/CD"
- For Leadership: "strategic", "team-building", "budget", "stakeholder", "roadmap"
- For entry-level: "eager to contribute", "quick learner", "motivated", "detail-oriented`
};

const buildUserPrompt = (student: any, targetRole: string) => {
  const skillsList = student.skills?.map((s: any) => 
    `${s.name} (${s.proficiency})`
  ).join(', ') || 'None listed';
  
  const projectsList = student.projects?.map((p: any) => 
    `${p.title}: ${p.description} [Tech: ${p.technologies?.join(', ') || 'N/A'}]${p.url ? ` [URL: ${p.url}]` : ''}`
  ).join('\n') || 'None listed';
  
  const certsList = student.certifications?.map((c: any) => 
    `${c.name} from ${c.issuer}${c.date ? ` (${c.date})` : ''}`
  ).join('\n') || 'None listed';
  
  const expList = student.experience?.map((e: any) => 
    `${e.title} at ${e.company}: ${e.description} [${e.startDate} - ${e.endDate || 'Present'}]`
  ).join('\n') || 'None listed';
  
  const eduList = student.education?.map((e: any) => 
    `${e.degree}${e.field ? ` in ${e.field}` : ''} at ${e.school}${e.graduationDate ? ` (${e.graduationDate})` : ''}`
  ).join('\n') || 'None listed';

  return `CANDIDATE PROFILE:

Basic Info:
- Name: ${student.name}
- Email: ${student.email}
- Phone: ${student.phone || 'N/A'}
- Location: ${student.location || 'N/A'}
- LinkedIn: ${student.linkedin || 'N/A'}
- GitHub: ${student.github || 'N/A'}
- Portfolio: ${student.portfolio || 'N/A'}
- Current Bio: ${student.bio || 'N/A'}

SKILLS:
${skillsList}

PROJECTS:
${projectsList}

CERTIFICATIONS:
${certsList}

WORK EXPERIENCE:
${expList}

EDUCATION:
${eduList}

TARGET ROLE: ${targetRole}

IMPORTANT NOTES:
- Translate project descriptions into professional achievements
- Convert informal language into corporate/business terminology
- Highlight leadership, collaboration, and technical depth
- For entry-level candidates, emphasize academic projects, certifications, and eagerness to learn
- For experienced candidates, focus on promotions, leadership, and business impact

OUTPUT ONLY the JSON object with the exact structure defined.`;
};

export async function generateResume(params: {
  student: any
  targetRole: string
  modelProvider?: ModelProvider
  industry?: string
  currentResume?: ResumeData
  regenerateSection?: string
}): Promise<ResumeData> {
  const {
    student,
    targetRole,
    modelProvider = 'gemini-flash',
    industry = 'technology',
    currentResume,
    regenerateSection,
  } = params;

  const modelConfig = {
    provider: modelProvider,
    temperature: regenerateSection ? 0.3 : 0.7, // Lower temp for targeted edits
    maxTokens: regenerateSection ? 2048 : 4096,
  };

  const model = (getModel(modelConfig) as any).withStructuredOutput(ResumeSchema);

  let promptContent: string;

  if (regenerateSection && currentResume) {
    // Targeted section regeneration
    promptContent = `You are an expert resume writer. Improve ONLY the ${regenerateSection} section of this resume for the target role: "${targetRole}".

CURRENT RESUME:
${JSON.stringify(currentResume, null, 2)}

INSTRUCTIONS:
- Rewrite ONLY the ${regenerateSection} section to be more impactful and tailored
- Keep all other sections exactly as they are
- Focus on making it more achievement-oriented and keyword-optimized
- Use strong action verbs and quantifiable results
- Maintain consistency with the rest of the resume

Return the COMPLETE resume object with all sections, where only the ${regenerateSection} has been improved.`;
  } else {
    // Full generation
    promptContent = `You are an expert resume writer and career coach with 15+ years of experience helping professionals land jobs at top companies including FAANG and Fortune 500 companies.

TARGET ROLE: ${targetRole}
INDUSTRY: ${industry}

CANDIDATE PROFILE:
${JSON.stringify(student, null, 2)}

INSTRUCTIONS:
1. Create a compelling, ATS-optimized resume tailored for the target role
2. Use powerful action verbs and quantifiable achievements
3. Optimize for both ATS (Applicant Tracking Systems) and human recruiters
4. Include relevant keywords from modern job descriptions
5. Keep content concise, professional, and achievement-oriented
6. Use STAR format (Situation, Task, Action, Result) for experience descriptions where possible
7. For each achievement, include metrics (percentages, dollar amounts, time saved, etc.)
8. Structure skills by relevance to the target role

OUTPUT: Return ONLY valid JSON with the complete resume structure.`;
  }

  try {
    const result = await model.invoke([
      {
        role: "system",
        content: "You are an expert resume writer. Return only valid JSON.",
      },
      {
        role: "user",
        content: promptContent,
      },
    ]);

    const resumeData = typeof result === 'string' 
      ? JSON.parse(result) 
      : { ...result };

    // Calculate ATS score
    const atsScore = calculateATSScore(resumeData, targetRole);

    return {
      ...resumeData,
      atsScore,
      suggestions: generateSuggestions(resumeData, atsScore),
    };
  } catch (error) {
    console.error('Resume generation error:', error);
    return createFallbackResume(student, targetRole);
  }
}

export async function tailorResumeData(params: {
  studentProfile: any;
  experience: any[];
  projects: any[];
  jobDescription: string;
}): Promise<ResumeData> {
  const { studentProfile, experience, projects, jobDescription } = params;
  
  return generateResume({
    student: { ...studentProfile, experience, projects },
    targetRole: jobDescription,
  });
}

function calculateATSScore(resume: ResumeData, targetRole: string): number {
  let score = 50; // Base score
  
  // Check for essential sections
  if (resume.professionalSummary && resume.professionalSummary.length > 100) score += 10;
  if (resume.experience.length >= 2) score += 10;
  if (resume.education.length >= 1) score += 5;
  if (resume.skills.length >= 8) score += 10;
  if (resume.projects.length >= 2) score += 5;
  
  // Check for quantitative achievements
  const hasMetrics = resume.experience.some(exp => 
    /\d+%|\$\d+|\d+ [a-zA-Z]+/.test(exp.description)
  );
  if (hasMetrics) score += 10;
  
  // Check contact info completeness
  const contactCount = [resume.personalInfo.phone, resume.personalInfo.linkedIn, 
                        resume.personalInfo.github, resume.personalInfo.portfolio]
    .filter(Boolean).length;
  score += contactCount * 2.5;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

function generateSuggestions(resume: ResumeData, atsScore: number): string[] {
  const suggestions: string[] = [];
  
  if (atsScore < 70) {
    suggestions.push("Add more quantifiable achievements with metrics");
    suggestions.push("Include more relevant keywords from job descriptions");
  }
  
  if (resume.professionalSummary.length < 100) {
    suggestions.push("Expand professional summary to 3-4 impactful sentences");
  }
  
  if (resume.skills.length < 10) {
    suggestions.push("Add more technical and soft skills relevant to your target role");
  }
  
  if (!resume.personalInfo.linkedIn) {
    suggestions.push("Add LinkedIn profile URL");
  }
  
  if (!resume.personalInfo.github) {
    suggestions.push("Add GitHub profile (especially important for tech roles)");
  }
  
  if (!resume.projects.length) {
    suggestions.push("Add at least 2-3 relevant projects");
  }
  
  return suggestions;
}

function createFallbackResume(student: any, targetRole: string): ResumeData {
  return {
    personalInfo: {
      name: student.name,
      email: student.email,
      phone: student.phone || null,
      location: student.location || null,
      linkedIn: student.linkedin || null,
      github: student.github || null,
      portfolio: student.portfolio || null,
    },
    professionalSummary: student.bio || `Professional ${targetRole} with relevant skills and experience.`,
    skills: student.skills?.map((s: any) => ({
      name: s.name,
      proficiency: s.proficiency || 'Intermediate',
      category: 'General',
    })) || [],
    experience: student.experience?.map((e: any) => ({
      title: e.title,
      company: e.company,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      isCurrentRole: e.isCurrentRole || false,
      achievements: [],
    })) || [],
    education: student.education?.map((e: any) => ({
      school: e.school,
      degree: e.degree,
      field: e.field || null,
      graduationDate: e.graduationDate || null,
      gpa: e.gpa || null,
    })) || [],
    projects: student.projects?.map((p: any) => ({
      title: p.title,
      description: p.description,
      technologies: p.technologies || [],
      url: p.url || null,
    })) || [],
    certifications: student.certifications?.map((c: any) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date || null,
    })) || [],
    atsScore: 60,
    suggestions: ["Add more detailed experience descriptions", "Include quantifiable achievements"],
  };
}

// Export type
export type { ResumeData };
export { ResumeSchema };
