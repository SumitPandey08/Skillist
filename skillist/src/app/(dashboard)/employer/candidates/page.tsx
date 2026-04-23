import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { ApplicantTable } from '@/components/jobs/applicant-table'
import { Sparkles, Users, Search, Filter, ShieldCheck, ArrowLeft, Brain } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
    <div className="max-w-7xl mx-auto space-y-10 pb-20 p-8">
      
      {/* Navigation & Header */}
      <div className="space-y-6">
        <Link href="/employer" className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-indigo-400 transition-colors w-fit">
          <ArrowLeft className="h-3 w-3 mr-2" /> Back to HQ
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" /> Pipeline Command
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Talent <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Pool</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl">
              Comprehensive overview of all active applicants across your requisitions, automatically ranked by our neural engine.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background/40 backdrop-blur-xl p-2 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="px-6 py-2 flex items-center gap-3">
                 <Users className="h-5 w-5 text-indigo-400" />
                 <div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-black">Global Applicants</div>
                    <div className="text-2xl font-black">{jobApplications.length}</div>
                 </div>
              </div>
          </div>
        </div>
      </div>

      {/* Main Pipeline Table */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3">
               <Search className="w-6 h-6 text-indigo-400" /> Advanced Filtering
            </h2>
            <div className="flex gap-2">
               <Badge variant="outline" className="h-8 bg-indigo-500/5 text-indigo-400 border-indigo-500/10 font-bold px-4">ALL STAGES</Badge>
               <Badge variant="outline" className="h-8 bg-white/5 text-muted-foreground border-white/5 font-bold px-4 opacity-50">TOP RANKED</Badge>
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <Filter className="w-4 h-4 text-muted-foreground" />
               </div>
            </div>
         </div>

         <div className="bg-background/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl p-2 overflow-hidden">
            <ApplicantTable data={jobApplications as any} />
         </div>
      </div>

      {/* Quick Actions / Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { title: 'Auto-Reject', desc: 'Candidates below 40% match score are automatically filtered into archives.', icon: ShieldCheck, color: 'text-rose-400' },
           { title: 'AI Screening', desc: 'Our engine has processed over 250 data points per applicant.', icon: Brain, color: 'text-purple-400' },
           { title: 'Direct Invite', desc: 'Schedule technical interviews directly from the applicant profile.', icon: Sparkles, color: 'text-amber-400' }
         ].map((tip, i) => (
           <div key={i} className="p-6 rounded-[2rem] bg-background/40 border border-white/5 flex items-start gap-4">
              <div className={cn("p-3 rounded-2xl bg-white/5 shrink-0", tip.color)}>
                 <tip.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-sm">{tip.title}</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  )
}
