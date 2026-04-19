import { fetchFromBackend } from '@/lib/api-server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, DollarSign, Calendar, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { auth } from '@clerk/nextjs/server'

export default async function JobsPage() {
  const { userId } = await auth()
  const activeJobs = await fetchFromBackend('/jobs')

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ECHFLUX</Link>
          <div className="flex gap-4">
            {userId ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4 max-w-5xl">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Explore Opportunities</h1>
            <p className="text-xl text-muted-foreground">Find roles that match your skills and potential.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs by title, company, or skills..." 
              className="pl-10 h-12 text-lg shadow-sm"
            />
          </div>

          <div className="grid gap-6">
            {activeJobs.length === 0 ? (
              <div className="text-center py-20 border rounded-xl bg-white">
                <p className="text-muted-foreground">No active jobs found. Check back soon!</p>
              </div>
            ) : (
              activeJobs.map((job: any) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                          <CardDescription className="text-lg font-medium text-slate-700 dark:text-slate-300 mt-1">
                            {job.company.companyName}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="capitalize">{job.jobType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" /> {job.location || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4" /> {job.salaryRange || 'Not disclosed'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
