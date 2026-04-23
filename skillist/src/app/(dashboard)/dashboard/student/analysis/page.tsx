import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { AnalysisClient } from './analysis-client'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'

export default async function AnalysisPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let data = { scores: null, student: null, skills: [] }
  try {
    data = await fetchFromBackend('/analytics/scores')
  } catch (error) {
    console.error('Failed to fetch analysis scores:', error)
  }

  return (
    <StudentDashboardLayout maxWidth="max-w-[1600px]">
      <AnalysisClient scores={data.scores} student={data.student} skills={data.skills} />
    </StudentDashboardLayout>
  )
}