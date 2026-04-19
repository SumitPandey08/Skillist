import { getModel } from './base-agent';
import logger from '../../core/logger';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class JobAgent {
  private model = getModel(0.7);

  async generateJobDescription(params: {
    title: string;
    skills: string[];
    companyName?: string;
    industry?: string;
    location?: string;
  }): Promise<string> {
    const { title, skills, companyName, industry, location } = params;
    
    const prompt = `
      You are an expert HR and Technical Recruiter. Your task is to generate a professional, engaging, and high-impact job description.
      
      Job Title: ${title}
      ${companyName ? `Company: ${companyName}` : ''}
      ${industry ? `Industry: ${industry}` : ''}
      ${location ? `Location: ${location}` : ''}
      Required Skills: ${skills.join(', ')}
      
      Please provide a comprehensive job description that includes:
      1. Role Overview (Exciting and welcoming)
      2. Core Responsibilities (Bullet points)
      3. Technical Requirements (Based on the provided skills)
      4. Preferred Qualifications (Additional relevant skills/experience)
      5. Why Join Us (Culture and impact)
      
      Format the output in clean Markdown. Use a professional and modern tone.
    `;

    try {
      const result = await this.model.invoke([
        new SystemMessage("You are an expert HR and Technical Recruiter."),
        new HumanMessage(prompt),
      ]);
      
      return typeof result.content === 'string' 
        ? result.content 
        : JSON.stringify(result.content);
    } catch (error: any) {
      logger.error(`[JobAgent] Failed to generate job description: ${error.message}`);
      throw new Error('AI generation failed. Please try again or write manually.');
    }
  }
}

export const jobAgent = new JobAgent();
