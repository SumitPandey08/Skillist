import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Clock, ArrowRight, BriefcaseIcon } from 'lucide-react'
import Link from 'next/link'

interface Application {
  id: string
  status: string
  matchScore: number | null
  createdAt: Date
  jobTitle: string
  companyName: string
}

interface RecentApplicationsProps {
  applications: Application[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  accepted: 'bg-green-500/10 text-green-600 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
  interview: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/30 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Recent Applications</h3>
          <p className="text-sm text-muted-foreground/70">Track your progress with top employers</p>
        </div>
        <Link href="/dashboard/student/applications">
          <Button variant="ghost" className="text-sm font-semibold text-primary">View All</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{app.jobTitle}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{app.companyName}</span>
                    <span className="text-xs text-muted-foreground/40">•</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider">Match</p>
                  <p className={`text-base font-bold ${
                    (app.matchScore || 0) >= 80 ? 'text-green-500' : 
                    (app.matchScore || 0) >= 50 ? 'text-amber-500' : 'text-primary'
                  }`}>
                    {app.matchScore || 0}%
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize border ${statusColors[app.status] || 'bg-muted text-muted-foreground border-border'}`}>
                  {app.status}
                </span>
                <Link href={`/jobs/applications/${app.id}`}>
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
              <BriefcaseIcon className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">No applications yet</p>
              <p className="text-xs text-muted-foreground/70">Start your journey by applying to jobs.</p>
            </div>
            <Link href="/jobs">
              <Button className="rounded-xl px-6 h-9 text-sm font-semibold">Explore Jobs</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
