import { auth } from '@clerk/nextjs/server'
import { db, eq, and, jobs } from '@/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Edit, Zap } from 'lucide-react'

export default async function EditJobPage(
  props: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await props.params

  const job = await db.query.jobs.findFirst({
    where: and(
        eq(jobs.id, id),
        eq(jobs.companyId, userId)
    )
  })

  if (!job) notFound()

  async function updateJob(formData: FormData) {
    'use server'
    const { userId } = await auth()
    if (!userId) return

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const salaryRange = formData.get('salaryRange') as string
    const jobType = formData.get('jobType') as string

    await db.update(jobs).set({
      title,
      description,
      location,
      salaryRange,
      jobType,
      updatedAt: new Date()
    }).where(
      and(
        eq(jobs.id, id),
        eq(jobs.companyId, userId)
      )
    )

    redirect('/employer/jobs')
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/employer/jobs" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors w-fit">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent w-fit flex items-center gap-2">
           <Edit className="h-6 w-6 text-blue-400" />
           Edit Job Requisition
        </h1>
        <p className="text-muted-foreground mt-2">Update your role requirements.</p>
      </div>

      <div className="glass p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <form action={updateJob} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide">Job Title</label>
            <Input 
              name="title" 
              required 
              defaultValue={job.title}
              className="bg-white/5 border-white/10 text-lg py-6 focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide">Location</label>
              <Input 
                name="location" 
                defaultValue={job.location || ''}
                className="bg-white/5 border-white/10 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide">Salary Range</label>
              <Input 
                name="salaryRange" 
                defaultValue={job.salaryRange || ''}
                className="bg-white/5 border-white/10 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide">Job Type</label>
            <Select name="jobType" defaultValue={job.jobType || 'full-time'}>
              <SelectTrigger className="bg-white/5 border-white/10 focus:ring-blue-500">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide">Job Description & Requirements</label>
            <Textarea 
              name="description" 
              required 
              defaultValue={job.description}
              className="min-h-[200px] bg-white/5 border-white/10 focus-visible:ring-blue-500 resize-y"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto font-bold tracking-wide">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
