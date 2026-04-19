'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { fetchFromBackend } from '@/lib/api-server'

export async function generateAssessment(skillName: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await fetchFromBackend('/assessment/generate', {
    method: 'POST',
    body: JSON.stringify({ skillName })
  })
}

export async function submitAssessment(data: any) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const result = await fetchFromBackend('/assessment/submit', {
    method: 'POST',
    body: JSON.stringify({ ...data, studentId: userId })
  })

  revalidatePath('/dashboard/student/assessment')
  return result
}
