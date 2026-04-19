import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'
import { JobForm } from '@/components/dashboard/employer/job-form'

export default async function NewJobPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <Link href="/employer/jobs" className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-indigo-400 mb-6 transition-colors w-fit">
          <ArrowLeft className="h-3 w-3 mr-2" /> Back to Requisitions
        </Link>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            <Zap className="w-3.5 h-3.5" /> Pipeline Activation
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
             New <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Requisition</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl">
            Post a new role and let our AI engine instantly analyze, rank, and match you with top-tier talent from the ecosystem.
          </p>
        </div>
      </div>

      <div className="bg-background/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <JobForm />
      </div>
    </div>
  )
}
