import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Briefcase, Calendar, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { ApplyButton } from '@/components/jobs/apply-button'
import { fetchFromBackend } from '@/lib/api-server'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const { userId } = await auth()
  
  let job: any
  try {
    job = await fetchFromBackend(`/jobs/${id}`)
  } catch (err) {
    notFound()
  }

  if (!job || job.status !== 'active') notFound()

  // Fetch student dashboard to check for existing application
  let existingApplication = null
  if (userId) {
    try {
      const dashboardData = await fetchFromBackend('/users/student/dashboard')
      existingApplication = dashboardData.student.applications.find((app: any) => app.jobId === id)
    } catch (err) {
      console.error('Error fetching application status:', err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Skillist</Link>
          <Link href="/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Jobs
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            {/* Main Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <Building2 className="h-4 w-4" />
                {job.company.companyName}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {job.location || 'Remote'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> {job.jobType || 'Full-time'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold border-b pb-2">Job Description</h2>
              <div className="mt-4 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Sidebar */}
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle>Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Salary Range</div>
                  <div className="text-lg font-bold text-primary">{job.salaryRange || 'Not disclosed'}</div>
                </div>
                <ApplyButton jobId={id} existingApplication={existingApplication} />
                <p className="text-[10px] text-center text-muted-foreground">
                  By applying, you agree to share your Skillist profile with {job.company.companyName}.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {job.skills.map((item: any) => (
                    <div key={item.skill.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium">{item.skill.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                        {item.requiredProficiency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="pt-6">
                <h3 className="font-bold text-sm mb-2">Why Skillist?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use AI to match your unique skills and projects to the specific needs of this role. 
                  Make sure your profile is 100% complete for the best chance!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
