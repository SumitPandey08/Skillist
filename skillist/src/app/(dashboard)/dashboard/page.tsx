import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'

export default async function DashboardDispatcher() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const data = await fetchFromBackend('/auth/me')
  const user = data?.user;

  if (!user?.role) redirect('/onboarding')

  if (user.role === 'student') {
    redirect('/dashboard/student')
  } else if (user.role === 'company') {
    redirect('/employer')
  }

  // Fallback (e.g., if role is set but no corresponding dashboard)
  redirect('/profile')
}
