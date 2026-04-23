'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, ArrowRight, Sparkles, Target, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AIInsight {
  insight: string
  action: string
  priority: 'high' | 'medium' | 'low'
}

interface CareerTarget {
  role: string
  matchScore: number
  gaps: string[]
}

interface DailyMission {
  id: string
  title: string
  description: string
  type: 'dsa' | 'project' | 'interview' | 'skill'
  completed: boolean
}

interface AIInsightBannerProps {
  userName: string
  careerTargets?: CareerTarget[]
  missions?: DailyMission[]
  overallReadiness?: number
}

export function AIInsightBanner({ 
  userName, 
  careerTargets = [], 
  missions = [],
  overallReadiness = 0 
}: AIInsightBannerProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [targetRole, setTargetRole] = useState<string>('Frontend Developer')
  const [targetMatch, setTargetMatch] = useState<number>(0)
  
  useEffect(() => {
    // Generate AI insights based on data
    const newInsights: AIInsight[] = []
    
    if (careerTargets.length > 0) {
      const topTarget = careerTargets[0]
      setTargetRole(topTarget.role)
      setTargetMatch(topTarget.matchScore)
      
      if (topTarget.matchScore >= 80) {
        newInsights.push({
          insight: `You are ${topTarget.matchScore}% ready for ${topTarget.role} roles`,
          action: 'Apply to top companies now',
          priority: 'high'
        })
      } else if (topTarget.matchScore >= 60) {
        newInsights.push({
          insight: `You are ${topTarget.matchScore}% ready for ${topTarget.role} roles`,
          action: `Focus on: ${topTarget.gaps.slice(0, 2).join(', ')}`,
          priority: 'medium'
        })
      } else {
        newInsights.push({
          insight: `You are ${topTarget.matchScore}% ready for ${topTarget.role} roles`,
          action: `Complete your profile to unlock matches`,
          priority: 'high'
        })
        
        if (topTarget.gaps.length > 0) {
          newInsights.push({
            insight: `Missing: ${topTarget.gaps[0]}`,
            action: 'Start learning path',
            priority: 'high'
          })
        }
      }
    } else {
      // Default insights
      setTargetRole('Tech Roles')
      setTargetMatch(overallReadiness)
      newInsights.push({
        insight: `You are ${overallReadiness}% job-ready`,
        action: overallReadiness >= 80 ? 'Start applying to jobs' : 'Complete your profile',
        priority: overallReadiness >= 80 ? 'high' : 'medium'
      })
    }
    
    setInsights(newInsights)
  }, [careerTargets, overallReadiness])

  const completedMissions = missions.filter(m => m.completed).length
  const totalMissions = missions.length || 3
  const missionProgress = (completedMissions / totalMissions) * 100

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      default: return 'text-green-500 bg-green-500/10 border-green-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <CardContent className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">AI Insight</p>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">
                  Hello, <span className="text-primary">{userName}</span> 👋
                </h2>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>

          {/* Main Insight */}
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "mb-6 p-4 rounded-2xl border backdrop-blur-sm",
                getPriorityColor(insight.priority)
              )}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-lg">{insight.insight}</p>
                  <p className="text-sm opacity-80 mt-1">{insight.action}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Daily Missions */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Today&apos;s Mission</h3>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {completedMissions}/{totalMissions} Complete
              </Badge>
            </div>

            {/* Mission Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="opacity-70">Progress</span>
                <span className="font-bold">{Math.round(missionProgress)}%</span>
              </div>
              <Progress value={missionProgress} className="h-2 bg-white/10" />
            </div>

            {/* Mission Items */}
            <div className="space-y-2">
              {(missions.length > 0 ? missions : [
                { id: '1', title: 'Solve 2 DSA problems', completed: completedMissions > 0, type: 'dsa' as const },
                { id: '2', title: 'Complete 1 project task', completed: completedMissions > 1, type: 'project' as const },
                { id: '3', title: 'Take 1 mock interview', completed: completedMissions > 2, type: 'interview' as const },
              ]).map((mission, idx) => (
                <div
                  key={mission.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all",
                    mission.completed 
                      ? "bg-green-500/20 border border-green-500/30" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    mission.completed 
                      ? "bg-green-500 border-green-500" 
                      : "border-white/30"
                  )}>
                    {mission.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    mission.completed ? "line-through opacity-60" : ""
                  )}>{mission.title}</span>
                  {mission.completed && <Zap className="w-4 h-4 text-green-400 ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button className="w-full mt-5 h-12 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl shadow-lg shadow-primary/25">
            Continue My Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}