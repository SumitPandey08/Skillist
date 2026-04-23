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
    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-background to-muted/20 border border-border/40 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tight">Active Applications</h3>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Track your progress with top employers</p>
        </div>
        <Link href="/dashboard/student/applications">
          <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl">View All</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[1.5rem] bg-background/50 border border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 group/app relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover/app:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover/app:scale-110 group-hover/app:rotate-[-5deg] transition-all duration-500 shadow-inner">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-black truncate group-hover/app:text-primary transition-colors tracking-tight">{app.jobTitle}</p>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className="text-xs font-bold text-muted-foreground">{app.companyName}</span>
                    <span className="text-xs text-muted-foreground/30">•</span>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/40">
                <div className="text-center sm:text-right px-4">
                  <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">AI Match</p>
                  <p className={`text-xl font-black ${(app.matchScore || 0) >= 80 ? 'text-emerald-500' : (app.matchScore || 0) >= 50 ? 'text-amber-500' : 'text-primary'}`}>
                    {app.matchScore || 0}%
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={`h-7 px-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${statusColors[app.status] || 'bg-muted text-muted-foreground border-border'}`}>
                    {app.status}
                  </Badge>
                  <Link href={`/jobs/applications/${app.id}`}>
                    <div className="h-11 w-11 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-500 group/btn">
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover/btn:text-primary transition-transform group-hover/btn:translate-x-1" />
                    </div>
                  </Link>
                </div>
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
