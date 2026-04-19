'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { fetchFromBackend } from '@/lib/api-server'

// --- Schemas ---

const skillSchema = z.object({
  name: z.string().min(1).max(50),
  category: z.string().optional(),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
})

const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  url: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const certSchema = z.object({
  name: z.string().min(1).max(100),
  issuer: z.string().min(1).max(100),
  issueDate: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
})

const jobSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  jobType: z.string().optional(),
  skills: z.array(z.object({
    id: z.string(),
    text: z.string()
  }))
})

// --- Actions ---

export async function createJob(data: z.infer<typeof jobSchema>) {
  const validated = jobSchema.parse(data)
  
  await fetchFromBackend('/jobs', {
    method: 'POST',
    body: JSON.stringify(validated)
  })

  revalidatePath('/employer/jobs')
  redirect('/employer/jobs')
}

export async function updateJob(jobId: string, data: z.infer<typeof jobSchema>) {
  const validated = jobSchema.parse(data)

  await fetchFromBackend(`/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(validated)
  })

  revalidatePath('/employer/jobs')
  redirect('/employer/jobs')
}

export async function addSkill(data: z.infer<typeof skillSchema>) {
  const validated = skillSchema.parse(data)

  await fetchFromBackend('/users/student/skills', {
    method: 'POST',
    body: JSON.stringify(validated)
  })

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function removeSkill(skillId: string) {
  await fetchFromBackend(`/users/student/skills/${skillId}`, {
    method: 'DELETE'
  })

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function addProject(data: z.infer<typeof projectSchema>) {
  const validated = projectSchema.parse(data)

  await fetchFromBackend('/users/student/projects', {
    method: 'POST',
    body: JSON.stringify(validated)
  })

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function deleteProject(projectId: string) {
  await fetchFromBackend(`/users/student/projects/${projectId}`, {
    method: 'DELETE'
  })

  revalidatePath('/dashboard')
}

export async function addCertification(data: z.infer<typeof certSchema>) {
  const validated = certSchema.parse(data)

  await fetchFromBackend('/users/student/certifications', {
    method: 'POST',
    body: JSON.stringify(validated)
  })

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function deleteCertification(certId: string) {
  await fetchFromBackend(`/users/student/certifications/${certId}`, {
    method: 'DELETE'
  })

  revalidatePath('/dashboard')
}

export async function updateBio(bio: string) {
  await fetchFromBackend('/users/student/bio', {
    method: 'PATCH',
    body: JSON.stringify({ bio })
  })

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function updatePlatformConnections(data: {
  githubUrl?: string
  leetcodeUrl?: string
  codeforcesUrl?: string
  linkedinUrl?: string
}) {
  await fetchFromBackend('/users/student/platform-connections', {
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  // Trigger backend sync
  try {
    await fetchFromBackend('/integrations/sync', { method: 'POST' })
  } catch (error) {
    console.error('Failed to trigger background sync:', error)
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function updateJobStatus(jobId: string, status: 'draft' | 'active' | 'closed') {
  await fetchFromBackend(`/jobs/${jobId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })

  revalidatePath('/employer/jobs')
}

export async function deleteJob(jobId: string) {
  await fetchFromBackend(`/jobs/${jobId}`, {
    method: 'DELETE'
  })

  revalidatePath('/employer/jobs')
}

export async function updateApplicationStatus(appId: string, status: string) {
  // We need to know which job this application belongs to for the backend route
  // Or we can add a generic update application route
  // For now, let's use a generic one if we add it or just fetch it
  
  // Let's check if we have a generic update application status route
  // Based on user.routes.ts, we have: router.patch('/:jobId/applications/:appId', ...)
  
  // To keep it simple, I'll update the backend to have a direct appId route or just fetch jobId here
  // Actually, I'll add a direct patch /users/applications/:appId/status to the backend
  
  await fetchFromBackend(`/users/applications/${appId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })

  revalidatePath(`/employer/candidates`)
  revalidatePath(`/employer/candidates/${appId}`)
}
