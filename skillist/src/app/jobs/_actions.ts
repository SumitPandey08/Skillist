'use server'

import { revalidatePath } from 'next/cache'
import { fetchFromBackend } from '@/lib/api'

export async function tailorResume(jobId: string) {
  // 1. Fetch full student profile from backend
  const profileData = await fetchFromBackend('/users/student/profile')
  const student = profileData.student

  if (!student) throw new Error('Student not found')

  // 2. Run AI tailoring via Backend API
  const tailored = await fetchFromBackend(`/matching/resume/tailor/${jobId}`, {
    method: 'POST'
  })

  if (!tailored) throw new Error('Tailoring failed')

  // 3. Construct tailored data object for PDF
  const tailoredExperience = student.experience.map((exp: any) => ({
    ...exp,
    description: tailored.tailoredExperience.find((t: any) => t.id === exp.id)?.tailoredDescription || exp.description
  }))

  const tailoredProjects = student.projects.map((proj: any) => ({
    ...proj,
    description: tailored.tailoredProjects.find((t: any) => t.id === proj.id)?.tailoredDescription || proj.description
  }))

  return {
    name: student.name,
    email: student.user.email,
    bio: tailored.tailoredBio,
    experience: tailoredExperience,
    projects: tailoredProjects,
    education: student.education,
    skills: student.skills.map((s: any) => ({ name: s.skill.name, proficiency: s.proficiency }))
  }
}

export async function applyToJob(jobId: string) {
  const result = await fetchFromBackend(`/jobs/${jobId}/apply`, {
    method: 'POST'
  })

  revalidatePath(`/jobs/${jobId}`)
  revalidatePath('/dashboard/student')
  
  return result
}
