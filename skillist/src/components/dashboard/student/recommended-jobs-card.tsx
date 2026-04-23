'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, MapPin, Zap, ArrowRight, IndianRupee } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AnimatedButton } from '@/components/ui/animated-button'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  companyName: string
  location: string
  salaryRange: string
  jobType: string
  matchScore: number
}

export function RecommendedJobsCard({ jobs = [] }: { jobs: Job[] }) {
  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-lg rounded-[2rem] overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-500" /> Top Matching Jobs
          </CardTitle>
          <Badge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase">
            AI Picked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-muted/30 border border-border/40 hover:border-emerald-500/30 transition-all group relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-3">
                   <div className="flex items-center gap-1 text-emerald-500">
                      <Zap className="w-3 h-3 fill-emerald-500" />
                      <span className="text-[10px] font-black">{job.matchScore}%</span>
                   </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-sm leading-tight group-hover:text-emerald-600 transition-colors pr-8">
                    {job.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">{job.companyName}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                    <MapPin className="w-3 h-3" /> {job.location || 'Remote'}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                    <IndianRupee className="w-3 h-3" /> {job.salaryRange || 'Market Std'}
                  </div>
                </div>

                <Link href={`/jobs/${job.id}`} className="mt-4">
                  <AnimatedButton className="w-full h-8 text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20">
                    Apply Now
                  </AnimatedButton>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
             <Briefcase className="w-12 h-12 mb-2" />
             <p className="text-xs font-black uppercase tracking-[0.2em]">No matches found yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
