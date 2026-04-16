import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { jobs } from '@/db/schema'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Briefcase, Zap } from 'lucide-react'
import { nanoid } from 'nanoid'

export default async function NewJobPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  async function createJob(formData: FormData) {
    'use server'
    const { userId } = await auth()
    if (!userId) return

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const salaryRange = formData.get('salaryRange') as string
    const jobType = formData.get('jobType') as string

    const id = nanoid()

    await db.insert(jobs).values({
      id,
      companyId: userId,
      title,
      description,
      location,
      salaryRange,
      jobType,
      status: 'active',
    })

    redirect('/employer/jobs')
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/employer/jobs" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors w-fit">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent w-fit flex items-center gap-2">
           <Zap className="h-6 w-6 text-indigo-400" />
           Create Job Requisition
        </h1>
        <p className="text-muted-foreground mt-2">Post a new role and let our AI engine instantly match you with top talent.</p>
      </div>

      <div className="glass p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <form action={createJob} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide">Job Title</label>
            <Input 
              name="title" 
              required 
              placeholder="e.g. Senior Frontend Engineer" 
              className="bg-white/5 border-white/10 text-lg py-6 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide">Location</label>
              <Input 
                name="location" 
                placeholder="e.g. Remote, New York, NY"
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide">Salary Range</label>
              <Input 
                name="salaryRange" 
                placeholder="e.g. $120k - $150k"
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wide">Job Type</label>
            <Select name="jobType" defaultValue="full-time">
              <SelectTrigger className="bg-white/5 border-white/10 focus:ring-indigo-500">
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
              placeholder="Describe the role, responsibilities, and required skills. Our AI will analyze this to find the best matches."
              className="min-h-[200px] bg-white/5 border-white/10 focus-visible:ring-indigo-500 resize-y"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto font-bold tracking-wide">
              <Briefcase className="h-5 w-5 mr-2" />
              Publish Role & Activate Pipeline
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
