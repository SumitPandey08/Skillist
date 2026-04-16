'use server'

import { fetchFromBackend } from './api'
import { revalidatePath } from 'next/cache'

export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone?: string
    location?: string
    linkedIn?: string
    github?: string
    portfolio?: string
  }
  professionalSummary: string
  skills: { name: string; proficiency: string }[]
  experience: {
    title: string
    company: string
    location?: string
    description: string
    startDate: string
    endDate?: string
    isCurrentRole?: boolean
  }[]
  education: {
    school: string
    degree: string
    field?: string
    graduationDate?: string
    gpa?: string
  }[]
  projects: {
    title: string
    description: string
    technologies: string[]
    url?: string
  }[]
  certifications: {
    name: string
    issuer: string
    date?: string
  }[]
}

export async function generateAIResume(studentData: any, targetRole?: string): Promise<ResumeData> {
  const data = await fetchFromBackend('/agentic/resume/generate', {
    method: 'POST',
    body: JSON.stringify({
      student: studentData,
      targetRole: targetRole || 'Software Engineer'
    })
  })
  
  return data.resume
}

export async function getUserResumes(studentId: string) {
  const data = await fetchFromBackend(`/users/student/${studentId}/resumes`)
  return data.resumes || []
}

export async function saveResume(studentId: string, resumeData: ResumeData) {
  const resume = {
    jobTitle: resumeData.personalInfo?.name ? `${resumeData.personalInfo.name}'s Resume` : 'General',
    content: resumeData
  }
  
  const data = await fetchFromBackend('/users/student/resumes', {
    method: 'POST',
    body: JSON.stringify(resume)
  })
  
  revalidatePath('/dashboard/student/resume')
  return data.resume
}

export async function updateResume(resumeId: string, resumeData: Partial<ResumeData>) {
  const data = await fetchFromBackend(`/users/student/resumes/${resumeId}`, {
    method: 'PATCH',
    body: JSON.stringify(resumeData)
  })
  
  revalidatePath('/dashboard/student/resume')
  return data.resume
}

export async function deleteResume(resumeId: string) {
  await fetchFromBackend(`/users/student/resumes/${resumeId}`, {
    method: 'DELETE'
  })
  
  revalidatePath('/dashboard/student/resume')
}

export async function getResumeTemplates() {
  return [
    {
      id: 'ats-optimized',
      name: 'ATS Optimized',
      description: 'Best for passing through Applicant Tracking Systems',
      atsScore: 95
    },
    {
      id: 'modern-tech',
      name: 'Modern Tech',
      description: 'Clean design tailored for tech companies',
      atsScore: 88
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Professional format for senior roles',
      atsScore: 90
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Standout design for design roles',
      atsScore: 75
    }
  ]
}