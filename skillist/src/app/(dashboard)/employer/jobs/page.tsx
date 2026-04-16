import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Plus, MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react'
import { JobActions } from '@/components/jobs/job-actions'

export default async function EmployerJobsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let companyJobs = [];
  try {
    companyJobs = await fetchFromBackend('/jobs/company')
  } catch (error) {
    console.error('Failed to fetch company jobs:', error)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Postings</h2>
          <p className="text-muted-foreground mt-1">Manage your active recruitment pipelines.</p>
        </div>
        <Link href="/employer/jobs/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {companyJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-white/10 rounded-2xl glass shadow-lg">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold">No jobs posted yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm mt-2">
              Start attracting top AI-matched talent by creating your first job requisition.
            </p>
            <Link href="/employer/jobs/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Post a Job</Button>
            </Link>
          </div>
        ) : (
          companyJobs.map((job: any) => (
            <Card key={job.id} className="overflow-hidden shadow-xl border-white/5 glass transition-all hover:border-indigo-500/30">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-indigo-400" /> {job.location || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-emerald-400" /> {job.salaryRange || 'Not disclosed'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-blue-400" /> {job.jobType || 'Full-time'}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`capitalize font-bold border-2 ${
                        job.status === 'active' ? 'border-green-500/50 text-green-400' 
                        : job.status === 'draft' ? 'border-orange-500/50 text-orange-400' 
                        : 'border-white/20 text-muted-foreground'
                      }`}
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-sm line-clamp-2 text-muted-foreground leading-relaxed mt-4 bg-white/5 p-4 rounded-lg border border-white/5">
                    {job.description}
                  </p>
                </div>
                
                <JobActions jobId={job.id} status={job.status} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
