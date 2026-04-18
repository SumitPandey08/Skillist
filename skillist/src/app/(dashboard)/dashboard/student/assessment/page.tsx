import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api'
import { redirect } from 'next/navigation'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { SkillTest } from '@/components/assessment/skill-test'

export const metadata: Metadata = {
  title: 'Skill Assessment | ECHFLUX',
  description: 'Test your technical skills and identify gaps with AI-driven assessments.',
}

export default async function AssessmentPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let student = null
  let assessments = []

  try {
    student = await fetchFromBackend(`/users/student/${userId}`)
    assessments = await fetchFromBackend(`/assessment/latest/${userId}`)
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

  return (
    <StudentDashboardLayout>
      <SkillTest studentData={student} initialAssessments={assessments} />
    </StudentDashboardLayout>
  )
}
