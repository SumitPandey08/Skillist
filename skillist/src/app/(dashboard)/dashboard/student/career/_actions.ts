'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { fetchFromBackend } from '@/lib/api-server'

export async function getCareerQuestions() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await fetchFromBackend(`/career/questions/${userId}`)
}

export async function recommendCareer(data: any) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const result = await fetchFromBackend('/career/recommend', {
    method: 'POST',
    body: JSON.stringify({ ...data, studentId: userId })
  })

  revalidatePath('/dashboard/student/career')
  return result
}
