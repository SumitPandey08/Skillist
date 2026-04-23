import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { MockInterview } from '@/components/dashboard/student/mock-interview'
import { InterviewFeedback } from '@/components/dashboard/student/interview-feedback'
import { redirect } from 'next/navigation'

export default async function MockInterviewPage({ searchParams }: { searchParams: { id?: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let interviewId = (await searchParams).id

  if (!interviewId) {
    // If no ID provided, try to find the latest active one
    try {
      const interviews = await fetchFromBackend('/users/student/interviews')
      if (interviews && interviews.length > 0) {
        interviewId = interviews[0].id
      }
    } catch (err) {
      console.error('Failed to fetch interviews:', err)
    }
    
    if (!interviewId) {
        redirect('/dashboard/student')
    }
  }

  let interview = null
  try {
    interview = await fetchFromBackend(`/users/student/interviews/${interviewId}`)
  } catch (error) {
    console.error('Failed to fetch interview details:', error)
    redirect('/dashboard/student')
  }

  if (interview.status === 'completed' && interview.feedback) {
    let evaluation = null
    try {
        evaluation = typeof interview.feedback === 'string' ? JSON.parse(interview.feedback) : interview.feedback
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
