import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

export async function generateResume(params: {
  student: {
    name: string
    email: string
    bio?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    portfolio?: string
    skills: { name: string; proficiency: string }[]
    projects: { title: string; description: string; technologies: string[]; url?: string }[]
    certifications: { name: string; issuer: string; date?: string }[]
    experience: { title: string; company: string; description: string; startDate: string; endDate?: string }[]
    education: { school: string; degree: string; field?: string; graduationDate?: string }[]
  }
  targetRole: string
}) {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.7,
    apiKey: process.env.GEMINI_API_KEY
  });

  const skillsList = params.student.skills.map(s => s.name).join(', ') || 'None listed';
  const projectsList = params.student.projects.map(p => 
    `${p.title}: ${p.description} (Technologies: ${p.technologies.join(', ')})`
  ).join('\n') || 'None listed';
  const certsList = params.student.certifications.map(c => `${c.name} from ${c.issuer}`).join('\n') || 'None listed';
  const expList = params.student.experience.map(e => 
    `${e.title} at ${e.company}: ${e.description}`
  ).join('\n') || 'None listed';
  const eduList = params.student.education.map(e => 
    `${e.degree} in ${e.field || 'General'} at ${e.school}`
  ).join('\n') || 'None listed';

  const prompt = `You are an expert resume writer. Create a professional, ATS-optimized resume tailored for the target role: "${params.targetRole}"

Generate ONLY valid JSON (no other text), with this exact structure:
{
  "personalInfo": {"name": "string", "email": "string", "phone": "string|null", "location": "string|null", "linkedIn": "string|null", "github": "string|null", "portfolio": "string|null"},
  "professionalSummary": "string",
  "skills": [{"name": "string", "proficiency": "string"}],
  "experience": [{"title": "string", "company": "string", "location": "string|null", "description": "string", "startDate": "string", "endDate": "string|null", "isCurrentRole": "boolean"}],
  "education": [{"school": "string", "degree": "string", "field": "string|null", "graduationDate": "string|null", "gpa": "string|null"}],
  "projects": [{"title": "string", "description": "string", "technologies": ["string"], "url": "string|null"}],
  "certifications": [{"name": "string", "issuer": "string", "date": "string|null"}]
}

CANDIDATE:
Name: ${params.student.name}
Email: ${params.student.email}
Phone: ${params.student.phone || 'N/A'}
Location: ${params.student.location || 'N/A'}
LinkedIn: ${params.student.linkedin || 'N/A'}
GitHub: ${params.student.github || 'N/A'}
Portfolio: ${params.student.portfolio || 'N/A'}
Skills: ${skillsList}
Experience: ${expList}
Projects: ${projectsList}
Certifications: ${certsList}
Education: ${eduList}
Current Bio: ${params.student.bio || 'N/A'}

Output ONLY the JSON object.`;

  const response = await model.invoke(prompt);
  let text = '';
  if (typeof response === 'string') {
    text = response;
  } else if (response && typeof response === 'object') {
    const msg = response as any;
    text = msg.content?.[0]?.text || String(response);
  }
  
  try {
    // Find JSON object in response
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx >= 0 && endIdx > startIdx) {
      const jsonStr = text.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error('Failed to parse JSON:', text);
  }
  
  return {
    personalInfo: {
      name: params.student.name,
      email: params.student.email,
      phone: params.student.phone || null,
      location: params.student.location || null,
      linkedIn: params.student.linkedin || null,
      github: params.student.github || null,
      portfolio: params.student.portfolio || null,
    },
    professionalSummary: params.student.bio || `Experienced ${params.targetRole} with strong skills.`,
    skills: params.student.skills.slice(0, 10),
    experience: [],
    education: params.student.education,
    projects: params.student.projects,
    certifications: params.student.certifications,
  };
}

const TailoredResumeSchema = z.object({
  tailoredBio: z.string(),
  tailoredExperience: z.array(z.object({
    id: z.string(),
    tailoredDescription: z.string(),
  })),
  tailoredProjects: z.array(z.object({
    id: z.string(),
    tailoredDescription: z.string(),
  })),
});

export async function tailorResumeData(params: {
  studentProfile: any
  experience: any[]
  projects: any[]
  jobDescription: string
}) {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY
  }).withStructuredOutput(TailoredResumeSchema);

  const result = await model.invoke([
    {
      role: "system",
      content: `You are an expert resume writer. Tailor the candidate's bio, experience, and project descriptions to highlight relevance to the specific job description provided. Maintain truthfulness but optimize for ATS and recruiter impact.`
    },
    {
      role: "user",
      content: `
      JOB DESCRIPTION:
      ${params.jobDescription}
      
      CANDIDATE BIO:
      ${params.studentProfile.bio}
      
      CANDIDATE EXPERIENCE:
      ${JSON.stringify(params.experience)}
      
      CANDIDATE PROJECTS:
      ${JSON.stringify(params.projects)}
      `
    }
  ]);

  return result;
}