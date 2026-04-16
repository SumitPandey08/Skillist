'use server'

import { fetchFromBackend } from '@/lib/api'

export async function completeOnboarding(formData: FormData) {
  const role = formData.get('role') as 'student' | 'company'
  const name = formData.get('name') as string
  const primarySkill = formData.get('primarySkill') as string
  const companyName = formData.get('companyName') as string
  const industry = formData.get('industry') as string

  try {
    await fetchFromBackend('/auth/onboarding', {
      method: 'POST',
      body: JSON.stringify({
        role,
        name,
        primarySkill,
        companyName,
        industry
      })
    })

    return { success: true }
  } catch (err) {
    console.error('Onboarding error:', err)
    throw err
  }
}
