import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api'
import { redirect } from 'next/navigation'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { CareerEngine } from '@/components/career/career-engine'

export const metadata: Metadata = {
  title: 'Career Engine | ECHFLUX',
  description: 'AI-driven career path recommendations based on your skills and preferences.',
}

export default async function CareerPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let student = null
  let recommendation = null
  let assessments = []

  try {
    student = await fetchFromBackend(`/users/student/${userId}`)
    recommendation = await fetchFromBackend(`/career/latest/${userId}`)
    assessments = await fetchFromBackend(`/assessment/latest/${userId}`)
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

  return (
    <StudentDashboardLayout>
      <CareerEngine 
        studentData={student} 
        initialRecommendation={recommendation}
        recentAssessments={assessments}
      />
    </StudentDashboardLayout>
  )
}
