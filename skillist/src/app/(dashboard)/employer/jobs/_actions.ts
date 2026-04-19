'use server'

import { fetchFromBackend } from '@/lib/api-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createJobAction(data: {
  title: string
  description: string
  location: string
  salaryRange: string
  jobType: string
  skills: string[]
}) {
  try {
    await fetchFromBackend('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        status: 'active'
      })
    })
  } catch (error) {
    console.error('Failed to create job:', error)
    return { error: 'Failed to create job' }
  }

  revalidatePath('/employer/jobs')
  redirect('/employer/jobs')
}

export async function generateJobDescriptionAction(data: {
  title: string
  skills: string[]
  location?: string
}) {
  try {
    const response = await fetchFromBackend('/agentic/generate-job-description', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return { description: response.description }
  } catch (error) {
    console.error('Failed to generate job description:', error)
    return { error: 'Failed to generate job description' }
  }
}
