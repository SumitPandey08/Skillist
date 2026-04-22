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
  Briefcase,
  Flame,
  Trophy,
  Target,
  Star,
  Crown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { getStudentAnalytics } from '@/app/(dashboard)/dashboard/student/analytics-actions'

interface TrackingWidgetProps {
  userId: string
}

interface ActivityEvent {
  eventType: string
  createdAt: Date
  payload?: string
}

interface Stats {
  resumesGenerated: number
  interviewsTaken: number
  skillsTested: number
  applicationsSent: number
}

interface MomentumData {
  streak: number
  rank: string
  xp: number
  level: number
  nextLevelXP: number
}

export function TrackingWidget({ userId }: TrackingWidgetProps) {
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [stats, setStats] = useState<Stats>({
    resumesGenerated: 0,
    interviewsTaken: 0,
    skillsTested: 0,
    applicationsSent: 0
  })
  const [momentum, setMomentum] = useState<MomentumData>({
    streak: 5,
    rank: 'Silver',
    xp: 1250,
    level: 3,
    nextLevelXP: 2000
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { activity: activityData, stats: statsData } = await getStudentAnalytics()
        setActivity(activityData || [])
        setStats(statsData || {
          resumesGenerated: 0,
          interviewsTaken: 0,
          skillsTested: 0,
          applicationsSent: 0
        })
        
        // Calculate momentum based on activity
        if (activityData?.length > 0) {
          const newXP = activityData.length * 100
          const newLevel = Math.floor(newXP / 500) + 1
          const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master']
          const newRank = ranks[Math.min(Math.floor(newLevel / 2), ranks.length - 1)]
          
          setMomentum({
            streak: Math.min(7, activityData.length),
            rank: newRank,
            xp: newXP,
            level: newLevel,
            nextLevelXP: newLevel * 500
          })
        }
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

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Bronze': return 'text-amber-700 bg-amber-700/10 border-amber-700/20'
      case 'Silver': return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
      case 'Gold': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
      case 'Platinum': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
      case 'Diamond': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'Master': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      default: return 'text-muted-foreground bg-muted/10 border-muted/20'
    }
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Master': return <Crown className="w-4 h-4" />
      case 'Diamond': return <Trophy className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Momentum System Card */}
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-indigo-500/5 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Flame className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Momentum</p>
                <p className="text-sm font-black">Level {momentum.level}</p>
              </div>
            </div>
            <Badge className={cn("border", getRankColor(momentum.rank))}>
              {getRankIcon(momentum.rank)}
              <span className="ml-1">{momentum.rank}</span>
            </Badge>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Flame className="w-5 h-5 text-amber-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-600 font-bold">Streak</span>
                <span className="text-lg font-black text-amber-500">{momentum.streak} days</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">XP Progress</span>
              <span className="font-bold">{momentum.xp} / {momentum.nextLevelXP}</span>
            </div>
            <Progress value={(momentum.xp / momentum.nextLevelXP) * 100} className="h-2" />
            <p className="text-[10px] text-muted-foreground text-center">
              {momentum.nextLevelXP - momentum.xp} XP to next level
            </p>
          </div>

          {/* Missions for today */}
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">Today&apos;s Tasks</span>
              <Badge variant="outline" className="text-[10px]">
                {Math.max(0, 3 - activity.length)} left
              </Badge>
            </div>
            <div className="space-y-1.5">
              {[
                { task: 'Solve 2 DSA problems', done: activity.some(a => a.eventType.includes('dsa')) },
                { task: 'Complete 1 project task', done: activity.some(a => a.eventType.includes('project')) },
                { task: 'Take mock interview', done: activity.some(a => a.eventType.includes('interview')) },
              ].map((item, idx) => (
                <div key={idx} className={cn(
                  "flex items-center gap-2 text-xs p-2 rounded-lg",
                  item.done ? "bg-green-500/10 text-green-600" : "bg-muted/30 text-muted-foreground"
                )}>
                  {item.done ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                  )}
                  {item.task}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <Card className="border border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Activity Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Resumes', value: stats.resumesGenerated, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Interviews', value: stats.interviewsTaken, icon: Bot, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Tests', value: stats.skillsTested, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Applied', value: stats.applicationsSent, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((stat, idx) => (
              <div key={idx} className={cn("p-3 rounded-xl border flex flex-col gap-1", stat.bg)}>
                <div className="flex items-center justify-between">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                  <span className="text-[10px] font-bold text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-xl font-black">{stat.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card className="border border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length > 0 ? (
            <div className="space-y-2">
              {activity.slice(0, 5).map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-background border shadow-sm">
                    {getEventIcon(event.eventType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{formatEventName(event.eventType)}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center opacity-40">
              <Zap className="w-8 h-8 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider">No activity yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}