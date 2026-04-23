import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { InterviewsClient } from './interviews-client'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'

export default async function InterviewsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let interviews = []
  let student = null

  try {
    const [interviewsData, profileData] = await Promise.all([
      fetchFromBackend('/users/student/interviews'),
      fetchFromBackend('/users/student/profile')
    ])
    interviews = interviewsData
    student = profileData.student
  } catch (error) {
    console.error('Failed to fetch interviews or student data:', error)
  }

  return (
    <StudentDashboardLayout maxWidth="max-w-[1600px]">
      <InterviewsClient interviews={interviews} student={student} />
    </StudentDashboardLayout>
  )
}
