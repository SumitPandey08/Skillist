import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface CompanyStatsProps {
  totalApplicants: number
  pendingReviews: number
  avgMatchScore: number
  topTalent: {
    id: string
    jobId: string
    studentName: string
    jobTitle: string
    matchScore: number
  }[]
}

export function CompanyStats({ totalApplicants, pendingReviews, avgMatchScore, topTalent }: CompanyStatsProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all active postings</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">Candidates awaiting feedback</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Match Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMatchScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall candidate quality</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Top Talent Spotlight
              </CardTitle>
              <CardDescription>Highest matching candidates across your roles.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTalent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No high-match candidates yet.</p>
            ) : (
              topTalent.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-sm group hover:border-primary/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold">{candidate.studentName}</span>
                    <span className="text-xs text-muted-foreground">Applied for: {candidate.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-primary">{candidate.matchScore}%</span>
                      <Badge variant="secondary" className="text-[9px] py-0 h-4">MATCH</Badge>
                    </div>
                    <Link href={`/dashboard/company/jobs/${candidate.jobId}/applicants/${candidate.id}`}>
                      <div className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
