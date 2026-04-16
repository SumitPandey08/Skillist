'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { fetchFromBackend } from '@/lib/api'

export async function triggerInterviewAnalysis(interviewId: string, role: string, transcript: any[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await fetchFromBackend('/agentic/analyze-interview', {
    method: 'POST',
    body: JSON.stringify({
      interviewId,
      studentId: userId,
      role,
      transcript
    })
  })

  revalidatePath('/dashboard/student/interviews')
}

export async function triggerSkillAnalysis(targetRole: string, currentSkills: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await fetchFromBackend('/agentic/analyze-skills', {
    method: 'POST',
    body: JSON.stringify({
      studentId: userId,
      targetRole,
      currentSkills
    })
  })

  revalidatePath('/dashboard/student/analysis')
}

export async function triggerRoadmapRefinement(roadmapId: string, targetRole: string, currentSkills: string[], initialRoadmap: any) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await fetchFromBackend('/agentic/refine-roadmap', {
    method: 'POST',
    body: JSON.stringify({
      roadmapId,
      studentId: userId,
      targetRole,
      currentSkills,
      initialRoadmap
    })
  })

  revalidatePath('/dashboard/student/roadmap')
}

