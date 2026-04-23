'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Trophy, Star, Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { getStudentAnalytics } from '@/app/(dashboard)/dashboard/student/analytics-actions'

export function GamifiedTrackingWidget() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const data = await getStudentAnalytics()
      if (data.stats) {
        setStats(data.stats)
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-lg rounded-[2rem] overflow-hidden">
        <CardContent className="p-6 flex items-center justify-center min-h-[150px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  const { xp = 0, streak = 0, level = 1, xpToNextLevel = 1000 } = stats || {}
  const progress = Math.round(((1000 - xpToNextLevel) / 1000) * 100)
  
  const rank = level >= 10 ? 'Elite' : level >= 5 ? 'Gold' : level >= 2 ? 'Silver' : 'Bronze'
  const rankColor = rank === 'Elite' ? 'text-purple-500' : 
                    rank === 'Gold' ? 'text-amber-500' : 
                    rank === 'Silver' ? 'text-slate-400' : 'text-orange-600'

  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-lg rounded-[2rem] overflow-hidden">
      <CardContent className="p-6 space-y-6">
        
        {/* Momentum / Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground/40'}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Momentum</p>
              <h3 className="text-xl font-black">{streak} Day Streak</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rank</p>
            <div className={`flex items-center gap-1 ${rankColor}`}>
              <Trophy className="w-4 h-4 fill-current" />
              <span className="font-bold">{rank}</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-primary"><Star className="w-3 h-3" /> {xp.toLocaleString()} XP</span>
            <span className="text-muted-foreground">{xpToNextLevel.toLocaleString()} to Level {level + 1}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-[10px] text-muted-foreground font-medium text-center pt-2">
            {streak > 0 
              ? "🔥 Keep it up! You're on fire." 
              : "👉 Complete today's mission to start a streak"}
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
