import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default async function EmployerDashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let data;
  try {
    data = await fetchFromBackend('/users/company/dashboard')
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading dashboard</h1>
        <p className="text-muted-foreground mt-2">Please make sure the backend is running.</p>
      </div>
    )
  }

  const { analytics, topTalent } = data

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Command Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-indigo-500/10 transition-shadow">
          <div className="text-sm text-muted-foreground font-medium mb-2">Total Candidates Processed</div>
          <div className="text-4xl font-extrabold text-foreground">{analytics.totalApplications}</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-indigo-500/10 transition-shadow">
          <div className="text-sm text-muted-foreground font-medium mb-2">Active Job Requisitions</div>
          <div className="text-4xl font-extrabold text-foreground">{analytics.activeJobs}</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-indigo-500/10 transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <div className="text-sm text-muted-foreground font-medium">High Match Candidates</div>
          </div>
          <div className="text-4xl font-extrabold text-indigo-400">{analytics.highMatchCandidates}</div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Recent Top Matches</h2>
        <div className="glass rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          {topTalent.length === 0 ? (
             <div className="p-12 flex flex-col items-center justify-center text-muted-foreground text-sm">
                <Sparkles className="h-8 w-8 mb-3 opacity-20" />
                <p>AI generated rankings will appear here once candidates apply.</p>
             </div>
          ) : (
            <div className="divide-y divide-white/5">
              {topTalent.map((candidate: any) => (                <div key={candidate.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div>
                    <h3 className="font-bold text-lg">{candidate.studentName}</h3>
                    <p className="text-sm text-muted-foreground">Applied for <span className="text-foreground">{candidate.jobTitle}</span></p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <div className="text-2xl font-black text-indigo-400">{candidate.matchScore}%</div>
                       <div className="text-[10px] tracking-wider uppercase font-semibold text-muted-foreground">Match Score</div>
                    </div>
                    <Link href={`/employer/candidates/${candidate.id}`}>
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
