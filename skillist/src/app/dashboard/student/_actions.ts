'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchFromBackend } from '@/lib/api-server'
import { nanoid } from 'nanoid'

export async function triggerSkillAnalysis(targetRole: string, currentSkills: string[]) {
  await fetchFromBackend('/agentic/analyze-skills', {
    method: 'POST',
    body: JSON.stringify({
      targetRole,
      currentSkills
    })
  })

  revalidatePath('/dashboard/student/analysis')
}

export async function createMockInterview(role: string) {
  const data = await fetchFromBackend('/users/student/interviews', {
    method: 'POST',
    body: JSON.stringify({ role })
  })
  return { id: data.id }
}

export async function addInterviewMessage(interviewId: string, role: 'interviewer' | 'candidate', content: string) {
  const data = await fetchFromBackend(`/users/student/interviews/${interviewId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ role, content })
  })
  return data
}

export async function completeMockInterview(interviewId: string) {
  const data = await fetchFromBackend(`/users/student/interviews/${interviewId}/complete`, {
    method: 'POST'
  })
  
  revalidatePath('/dashboard/student')
  return data
}

export async function generateAndSaveRoadmap(targetRole: string) {
  const data = await fetchFromBackend('/users/student/roadmaps', {
    method: 'POST',
    body: JSON.stringify({ targetRole })
  })

  revalidatePath('/dashboard/student')
  return { success: true, roadmapId: data.roadmap.id }
}

export async function getStudentRoadmap() {
  const data = await fetchFromBackend('/users/student/roadmaps')
  return data[0] || null // Backend returns array
}

export async function updateRoadmapStepStatus(stepId: string, status: 'pending' | 'in_progress' | 'completed') {
  await fetchFromBackend(`/users/student/roadmaps/steps/${stepId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })

  revalidatePath('/dashboard/student')
  return { success: true }
}

export async function deleteRoadmap(roadmapId: string) {
  await fetchFromBackend(`/users/student/roadmaps/${roadmapId}`, {
    method: 'DELETE'
  })
  
  revalidatePath('/dashboard/student')
  return { success: true }
}

export async function uploadAndParseResume(formData: FormData) {
  const file = formData.get('resume') as File
  if (!file) throw new Error('No file provided')

  // 1. Upload to Supabase Storage (Keep this in frontend for simplicity)
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `resumes/${nanoid(10)}.pdf`
  
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('resumes')
    .upload(fileName, buffer, {
      contentType: 'application/pdf',
      upsert: true
    })

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

  const resumeUrl = supabaseAdmin.storage.from('resumes').getPublicUrl(fileName).data.publicUrl

  // 2. Call backend to start parsing
  await fetchFromBackend('/resume/upload', {
    method: 'POST',
    body: JSON.stringify({ fileUrl: resumeUrl })
  })

  revalidatePath('/dashboard/student')
  return { success: true, resumeUrl }
}
