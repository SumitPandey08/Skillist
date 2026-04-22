'use server'

import { fetchFromBackend } from '@/lib/api-server'

export async function completeOnboarding(formData: FormData) {
  console.log('[ACTION] completeOnboarding started');
  const role = formData.get('role') as 'student' | 'company'
  const name = formData.get('name') as string
  const primarySkill = formData.get('primarySkill') as string
  const currentGrade = formData.get('currentGrade') as string
  const intent = formData.get('intent') as string
  const companyName = formData.get('companyName') as string
  const industry = formData.get('industry') as string

  console.log(`[ACTION] Onboarding data: role=${role}, name=${name}, intent=${intent}`);

  try {
    const response = await fetchFromBackend('/auth/onboarding', {
      method: 'POST',
      body: JSON.stringify({
        role,
        name,
        primarySkill,
        currentGrade,
        intent,
        companyName,
        industry
      })
    })

    console.log('[ACTION] Onboarding successful:', JSON.stringify(response));
    return { success: true }
  } catch (err) {
    console.error('[ACTION] Onboarding error:', err)
    throw err
  }
}
