import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { ResumeMaker } from '@/components/resume/resume-maker'

const defaultStudent = {
  id: '',
  name: 'Your Name',
  email: 'your@email.com',
  bio: '',
  phone: '',
  location: '',
  linkedin: '',
  githubUsername: '',
  portfolioUrl: '',
  skills: [],
  projects: [],
  certifications: [],
  experience: [],
  education: []
}

export const metadata: Metadata = {
  title: 'AI Resume Maker | Skillist - Generate SEO-Optimized Resumes',
  description: 'Create professional, ATS-optimized resumes with AI. Tailor your resume for specific job applications and boost your chances of getting hired.',
  keywords: ['resume maker', 'AI resume', 'resume generator', 'ATS resume', 'job resume', 'resume builder'],
  openGraph: {
    title: 'AI Resume Maker | Skillist',
    description: 'Create professional, ATS-optimized resumes with AI',
    type: 'website',
  },
}

interface ResumePageProps {
  params: Promise<{ slug?: string }>
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { slug } = await params
  
  let student: any = null
  let resumes: any[] = []
  
  try {
    const data = await fetchFromBackend('/users/student/dashboard')
    student = data.student
    
    if (!student) {
      redirect('/onboarding')
    }

    const resumesData = await fetchFromBackend('/users/student/resumes')
    resumes = resumesData.resumes || []
  } catch (error) {
    console.error('Failed to fetch student data:', error)
  }

  if (!student) {
    student = defaultStudent
  }

  return (
    <StudentDashboardLayout>
      <ResumeMaker studentData={student} initialResumes={resumes} />
    </StudentDashboardLayout>
  )
}