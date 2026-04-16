import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api'
import { redirect } from 'next/navigation'

export default async function DashboardDispatcher() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let user;
  try {
    user = await fetchFromBackend('/auth/me')
  } catch (error) {
    console.error('Failed to fetch user:', error)
    redirect('/onboarding')
  }

  if (!user?.role) redirect('/onboarding')

  if (user.role === 'student') {
    redirect('/dashboard/student')
  } else if (user.role === 'company') {
    redirect('/employer')
  }

  // Fallback (e.g., if role is set but no corresponding dashboard)
  redirect('/profile')
}
