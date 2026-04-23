'use client'

import { useState, useEffect } from 'react'
import { Briefcase, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Application {
  id: string
  jobTitle: string
  companyName: string
  status: 'pending' | 'accepted' | 'rejected' | 'interview'
  matchScore: number
  createdAt: Date
}

interface SmartApplicationsCardProps {
  applications: Application[]
}

interface ApplicationInsight {
  type: 'success' | 'warning' | 'tip'
  message: string
}

export function SmartApplicationsCard({ applications }: SmartApplicationsCardProps) {
  const [insights, setInsights] = useState<ApplicationInsight[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
    avgMatchScore: 0
  })

  useEffect(() => {
    if (applications.length > 0) {
      const pending = applications.filter(a => a.status === 'pending').length
      const interview = applications.filter(a => a.status === 'interview').length
      const accepted = applications.filter(a => a.status === 'accepted').length
      const rejected = applications.filter(a => a.status === 'rejected').length
      const avgMatch = Math.floor(applications.reduce((acc, a) => acc + a.matchScore, 0) / applications.length)
      
      setStats({
        total: applications.length,
        pending,
        interview,
        accepted,
        rejected,
        avgMatchScore: avgMatch
      })

      // Generate AI insights
      const newInsights: ApplicationInsight[] = []
      
      if (rejected > 0 && avgMatch < 60) {
        newInsights.push({
          type: 'warning',
          message: `You're getting rejected due to low match scores. Improve your profile to increase chances.`
        })
      }
      
      if (interview > 0) {
        newInsights.push({
          type: 'success',
          message: `Great! You're getting interview calls. Keep up the momentum.`
        })
      }
      
      if (pending > 2 && avgMatch < 50) {
        newInsights.push({
          type: 'tip',
          message: `Your pending applications have low match scores. Consider applying to better-matched jobs.`
        })
      }

      if (accepted > 0) {
        newInsights.push({
          type: 'success',
          message: `Congratulations on ${accepted} acceptance${accepted > 1 ? 's' : ''}! You're on the right track.`
        })
      }

      if (newInsights.length === 0 && applications.length > 0) {
        newInsights.push({
          type: 'tip',
          message: `Keep applying! Consistency is key to landing your dream job.`
        })
      }
      
      setInsights(newInsights)
    }
  }, [applications])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />
      case 'interview': return <Clock className="w-4 h-4 text-blue-500" />
      default: return <Clock className="w-4 h-4 text-amber-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'interview': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20 text-green-600'
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-600'
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Application Insights
            </CardTitle>
            <Link href="/dashboard/student/applications">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats Grid */}
          {applications.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-xl bg-muted/30 text-center">
                <p className="text-xl font-black">{stats.total}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-center">
                <p className="text-xl font-black text-blue-500">{stats.interview}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Interview</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-center">
                <p className="text-xl font-black text-green-500">{stats.accepted}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Accepted</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-center">
                <p className="text-xl font-black text-amber-500">{stats.pending}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Pending</p>
              </div>
            </div>
          )}

          {/* AI Insights */}
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-3 rounded-xl border flex items-start gap-2",
                getInsightColor(insight.type)
              )}
            >
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium">{insight.message}</p>
            </motion.div>
          ))}

          {/* Applications List */}
          {applications.length > 0 ? (
            <div className="space-y-2">
              {applications.slice(0, 3).map((app, idx) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{app.jobTitle}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[9px] text-muted-foreground uppercase">Match</p>
                      <p className={cn(
                        "text-sm font-bold",
                        app.matchScore >= 80 ? 'text-green-500' :
                        app.matchScore >= 50 ? 'text-amber-500' : 'text-primary'
                      )}>
                        {app.matchScore}%
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", getStatusColor(app.status))}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1 capitalize">{app.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No applications yet</p>
              <Link href="/jobs">
                <Button variant="link" size="sm" className="mt-2 text-primary">
                  Explore Jobs <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* CTA */}
          {applications.length > 0 && (
            <Link href="/jobs">
              <Button className="w-full">
                Apply to More Jobs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}