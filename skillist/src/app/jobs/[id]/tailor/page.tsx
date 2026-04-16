import { auth } from '@clerk/nextjs/server'
import { db, eq, jobs } from '@/db'
import { notFound, redirect } from 'next/navigation'
import { ResumeTailor } from '@/components/resume/resume-tailor'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function TailorPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  })

  if (!job || job.status !== 'active') notFound()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">ECHFLUX</Link>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm font-medium">Resume Tailor</span>
          </div>
          <Link href={`/jobs/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4 max-w-2xl text-center">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Tailor Your Impact</h1>
          <p className="text-xl text-muted-foreground">
            Get an ATS-optimized PDF resume specifically tuned for the <strong>{job.title}</strong> role.
          </p>
        </div>

        <ResumeTailor jobId={id} jobTitle={job.title} />
        
        <div className="mt-12 p-6 border rounded-xl bg-blue-50/50 text-left">
          <h3 className="font-bold text-blue-900 mb-2">How it works</h3>
          <ul className="space-y-3 text-sm text-blue-800/80">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
              AI analyzes the job description keywords and required skills.
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
              Your experience and project descriptions are re-written to highlight matching strengths.
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
              A clean, single-column PDF is generated, ready for submission to any ATS.
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
