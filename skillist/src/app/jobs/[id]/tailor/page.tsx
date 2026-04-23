import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { ResumeTailor } from '@/components/resume/resume-tailor'
import { ArrowLeft, Sparkles, Target, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { fetchFromBackend } from '@/lib/api-server'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function TailorPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params
  let job;
  try {
    job = await fetchFromBackend(`/jobs/${id}`)
  } catch (error) {
    console.error('Failed to fetch job:', error)
    notFound()
  }

  if (!job || job.status !== 'active') notFound()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Skillist
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">AI Resume Tailor</span>
            </div>
          </div>
          <Link href={`/jobs/${id}`}>
            <Button variant="ghost" size="sm" className="hover:bg-primary/5 hover:text-primary transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Details
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Context & Info */}
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary font-bold">
                PHASE 4: AI MATCHING
              </Badge>
              <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                Tailor Your <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Impact</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our AI engine analyzes the <span className="text-foreground font-bold">{job.title}</span> role and optimizes your profile to highlight your most relevant achievements.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                How AI Tailoring Works
              </h3>
              <div className="grid gap-4">
                {[
                  { 
                    step: 1, 
                    title: "Keyword Extraction", 
                    desc: "AI scans the job description for technical skills and behavioral traits." 
                  },
                  { 
                    step: 2, 
                    title: "Content Optimization", 
                    desc: "Your experience is re-written using action verbs that resonate with recruiters." 
                  },
                  { 
                    step: 3, 
                    title: "ATS Readiness", 
                    desc: "A clean, high-score PDF is generated, ready for instant submission." 
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border hover:border-primary/20 transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-sm font-medium text-indigo-900">
                Companies using ATS reject 75% of resumes. We help you pass.
              </p>
            </div>
          </div>

          {/* Right Side: Action Card */}
          <div className="lg:mt-12">
            <ResumeTailor jobId={id} jobTitle={job.title} />
            
            <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale pointer-events-none">
              <span className="text-xs font-black uppercase tracking-widest">ATS Verified</span>
              <span className="text-xs font-black uppercase tracking-widest">HR Approved</span>
              <span className="text-xs font-black uppercase tracking-widest">AI Enhanced</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
