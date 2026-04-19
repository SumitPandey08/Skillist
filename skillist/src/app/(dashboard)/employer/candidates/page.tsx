import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { ApplicantTable } from '@/components/jobs/applicant-table'
import { Sparkles, Users } from 'lucide-react'

export default async function CandidatesPipelinePage(
  props: { searchParams: Promise<{ jobId?: string }> }
) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  
  const searchParams = await props.searchParams
  const jobId = searchParams.jobId

  let jobApplications = []
  try {
    const query = jobId ? `?jobId=${jobId}` : ''
    jobApplications = await fetchFromBackend(`/users/company/candidates${query}`)
  } catch (error) {
    console.error('Failed to fetch candidates:', error)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Talent Pipeline</h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            AI-Ranked Applicant Pool
          </p>
        </div>
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
          <Users className="h-5 w-5 text-indigo-400" />
          <div>
             <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Candidates</div>
             <div className="text-xl font-black">{jobApplications.length}</div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/5 shadow-2xl p-1 overflow-hidden">
        <ApplicantTable data={jobApplications as any} />
      </div>
    </div>
  )
}
