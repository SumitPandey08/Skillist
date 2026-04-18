'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  History, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  FileText,
  Bot,
  Zap,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TrackingWidgetProps {
  userId: string
}

export function TrackingWidget({ userId }: TrackingWidgetProps) {
  const [activity, setActivity] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [activityRes, statsRes] = await Promise.all([
          fetch('/api/proxy/analytics/activity'),
          fetch('/api/proxy/analytics/stats')
        ])
        
        const activityData = await activityRes.json()
        const statsData = await statsRes.json()
        
        setActivity(activityData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to fetch tracking data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'resume_generated': return <FileText className="w-4 h-4 text-blue-500" />
      case 'interview_completed': return <Bot className="w-4 h-4 text-purple-500" />
      case 'skill_test_completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'job_applied': return <Briefcase className="w-4 h-4 text-amber-500" />
      default: return <Activity className="w-4 h-4 text-primary" />
    }
  }

  const formatEventName = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Resumes', value: stats?.resumesGenerated || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Interviews', value: stats?.interviewsTaken || 0, icon: Bot, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Tests', value: stats?.skillsTested || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Applied', value: stats?.applicationsSent || 0, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <div key={idx} className={cn("p-4 rounded-2xl border flex flex-col gap-2", stat.bg)}>
            <div className="flex items-center justify-between">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <Badge variant="ghost" className="h-5 px-1 font-black text-[10px]">{stat.label}</Badge>
            </div>
            <div className="text-2xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Timeline */}
      <Card className="border-2 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
            <History className="w-5 h-5 text-primary" />
            Growth Timeline
          </CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Tracking your AI journey</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {activity.length > 0 ? (
            <div className="divide-y">
              {activity.map((event, idx) => (
                <div key={idx} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                  <div className="mt-1 p-2 rounded-xl bg-background border shadow-sm">
                    {getEventIcon(event.eventType)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black uppercase tracking-tight leading-none">
                        {formatEventName(event.eventType)}
                      </p>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {event.payload && (
                        <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
                            {JSON.parse(event.payload).skillName || JSON.parse(event.payload).role || ''}
                        </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
              <Zap className="w-12 h-12 mb-2" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">No events tracked yet</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Momentum Meter */}
      <Card className="border-2 border-primary/10 bg-primary/5">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Momentum Meter</h4>
            <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Level 2 Path</span>
            </div>
          </div>
          <Progress value={Math.min(activity.length * 10, 100)} className="h-1.5" />
          <p className="text-[10px] font-bold text-muted-foreground leading-tight">
            Complete <span className="text-primary font-black">3 more tasks</span> this week to reach Peak Productivity.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
