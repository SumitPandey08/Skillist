import { auth } from '@clerk/nextjs/server'
import { db, eq, desc, mockInterviews } from '@/db'
import { MockInterview } from '@/components/dashboard/student/mock-interview'
import { InterviewFeedback } from '@/components/dashboard/student/interview-feedback'
import { redirect } from 'next/navigation'

export default async function MockInterviewPage({ searchParams }: { searchParams: { id?: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let interviewId = (await searchParams).id

  if (!interviewId) {
    // If no ID provided, try to find the latest active one
    const latest = await db.query.mockInterviews.findFirst({
      where: eq(mockInterviews.studentId, userId),
      orderBy: [desc(mockInterviews.createdAt)]
    })
    
    if (!latest) {
        redirect('/candidate')
    }
    
    interviewId = latest.id
  }

  const interview = await db.query.mockInterviews.findFirst({
    where: eq(mockInterviews.id, interviewId),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.createdAt)]
      }
    }
  })

  if (!interview || interview.studentId !== userId) {
    redirect('/candidate')
  }

  if (interview.status === 'completed' && interview.feedback) {
    let evaluation = null
    try {
        evaluation = JSON.parse(interview.feedback)
    } catch (e) {
        console.error("Failed to parse evaluation", e)
    }

    if (evaluation) {
        return (
            <div className="p-8 h-full bg-gradient-to-br from-background to-background/50 overflow-y-auto">
                <InterviewFeedback 
                    evaluation={evaluation} 
                    role={interview.role} 
                />
            </div>
        )
    }
  }

  return (
    <div className="p-8 h-full bg-gradient-to-br from-background to-background/50">
      <MockInterview 
        interviewId={interview.id} 
        role={interview.role} 
        initialMessages={interview.messages as any} 
      />
    </div>
  )
}
