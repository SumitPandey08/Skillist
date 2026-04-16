import { auth } from '@clerk/nextjs/server'
import { db, eq, desc, mockInterviews, students } from '@/db'
import { redirect } from 'next/navigation'
import { InterviewsClient } from './interviews-client'

export default async function InterviewsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const interviews = await db.query.mockInterviews.findMany({
    where: eq(mockInterviews.studentId, userId),
    orderBy: desc(mockInterviews.createdAt),
  })

  const student = await db.query.students.findFirst({
    where: eq(students.id, userId),
  })

  return <InterviewsClient interviews={interviews} student={student} />
}