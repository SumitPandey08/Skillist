import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchFromBackend } from '@/lib/api-server'
import { fetchLeetCodeStats } from '@/lib/integrations/leetcode'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { DSAContent } from './dsa-content'

export default async function DSAPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let data;
  try {
    data = await fetchFromBackend('/users/student/dashboard')
  } catch (error) {
    console.error('Failed to fetch student dashboard for DSA page:', error)
    return <div>Error loading dashboard</div>
  }

  const { student } = data
  if (!student) redirect('/onboarding')

  const leetcodeStats = student.leetcodeUsername 
    ? await fetchLeetCodeStats(student.leetcodeUsername) 
    : null

  return (
    <StudentDashboardLayout>
      <DSAContent 
        leetcodeStats={leetcodeStats} 
        leetcodeUsername={student.leetcodeUsername}
      />
    </StudentDashboardLayout>
  )
}
