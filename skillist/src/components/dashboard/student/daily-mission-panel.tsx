'use client'

import { motion } from 'framer-motion'
import { Target, CheckCircle2, Circle, ArrowRight, Sparkles, Flame, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AnimatedButton } from '@/components/ui/animated-button'
import { Badge } from '@/components/ui/badge'

interface DailyMissionPanelProps {
  studentName: string
  intent: string
  score: number
  primarySkill: string
  careerRecommendation?: any
  roadmap?: any
}

export function DailyMissionPanel({ 
  studentName, 
  intent, 
  score, 
  primarySkill,
  careerRecommendation,
  roadmap 
}: DailyMissionPanelProps) {
  const targetRole = primarySkill || (intent === 'explore' ? 'Tech Roles' : 'Software Engineering')
  
  // Use real gap analysis or action plan if available
  const actionPlan = careerRecommendation ? JSON.parse(careerRecommendation.actionPlan) : []
  const gapAnalysis = careerRecommendation ? JSON.parse(careerRecommendation.gapAnalysis) : []
  
  // Create missions from action plan or roadmap
  const missions = roadmap?.steps 
    ? roadmap.steps.slice(0, 3).map((step: any) => ({
        text: step.title,
        done: step.status === 'completed'
      }))
    : actionPlan.slice(0, 3).map((item: any) => ({
        text: item.step,
        done: false
      }))

  // If still no missions, use defaults
  if (missions.length === 0) {
    missions.push(
      { text: 'Solve 2 DSA problems', done: true },
      { text: `Complete 1 ${targetRole} project task`, done: false },
      { text: 'Take 1 mock interview', done: false }
    )
  }

  const completedCount = missions.filter((m: any) => m.done).length
  const progress = Math.round((completedCount / missions.length) * 100) || 0

  const topGap = gapAnalysis[0]?.skill || 'System Design'

  return (
    <Card className="relative overflow-hidden border-0 bg-background/80 backdrop-blur-2xl shadow-2xl shadow-primary/5 rounded-[2.5rem] group">
      {/* AI Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-primary/5 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[100px] rounded-full" />

      <CardContent className="relative z-10 p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-10 justify-between items-start md:items-center">
          
          {/* Left: AI Insight */}
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> AI Insight
                </Badge>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-emerald-500/30 text-emerald-600 bg-emerald-500/5 px-2 py-0.5">
                  Recruiter Favorite
                </Badge>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
                You are <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">{score}% ready</span> for {targetRole}.
              </h2>
              <p className="text-muted-foreground font-medium text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Improve {topGap} to unlock top matching jobs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <AnimatedButton className="h-14 px-8 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 gap-2">
                Continue My Journey <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
              
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Recruiter POV</p>
                <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  "Highly Technical" 
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </p>
              </div>
            </div>
          </div>

          {/* Right: Daily Mission */}
          <div className="w-full md:w-80 shrink-0 bg-background/50 rounded-3xl p-6 border border-border/50 shadow-inner backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Today's Mission
              </h3>
              <span className="text-xs font-bold text-muted-foreground">{progress}%</span>
            </div>
            
            <Progress value={progress} className="h-2 mb-6 bg-muted/50" />

            <div className="space-y-3">
              {missions.map((task: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/40 hover:border-primary/30 transition-colors cursor-pointer group/task">
                  {task.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground shrink-0 group-hover/task:text-primary transition-colors" />
                  )}
                  <span className={`text-sm font-bold truncate ${task.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
