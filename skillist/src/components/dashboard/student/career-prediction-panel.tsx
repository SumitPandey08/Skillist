'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, TrendingUp, Clock, IndianRupee, Sparkles, Zap } from 'lucide-react'

interface CareerPredictionPanelProps {
  primarySkill?: string
  currentSkillsCount?: number
  projectsCount?: number
  certsCount?: number
  applicationsCount?: number
  readinessScore?: number
}

export function CareerPredictionPanel({ 
  primarySkill,
  currentSkillsCount = 0,
  projectsCount = 0,
  certsCount = 0,
  applicationsCount = 0,
  readinessScore = 0
}: CareerPredictionPanelProps) {
  const role = primarySkill || 'Backend Developer'
  
  const profileScore = Math.min(100, 
    (currentSkillsCount * 5) + 
    (projectsCount * 10) + 
    (certsCount * 8) + 
    (applicationsCount * 2) +
    readinessScore
  )
  
  const matchScore = Math.min(95, Math.floor(profileScore * 0.9))
  const timeToJob = Math.max(3, Math.floor((100 - profileScore) / 15))
  
  return (
    <Card className="border-0 bg-gradient-to-br from-primary to-indigo-600 text-white shadow-2xl shadow-indigo-500/20 rounded-[2rem] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
        <TrendingUp size={120} />
      </div>
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Career Prediction
          </CardTitle>
          <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-white/20 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3" /> AI Powered
          </div>
        </div>
        <p className="text-sm font-bold mt-1">If you continue this path:</p>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-wider">{role}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60">Match Score</p>
            <p className="text-lg font-black">{matchScore}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-black uppercase text-white/60 mb-1 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Salary Range</p>
            <p className="text-lg font-black">₹6–12 LPA</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-black uppercase text-white/60 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time to Job</p>
            <p className="text-lg font-black">{timeToJob} months</p>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/30">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-3 h-3 text-amber-300" />
            <span className="text-[10px] font-bold text-amber-200">Next Milestone</span>
          </div>
          <p className="text-xs font-medium text-white">Complete 2 more projects</p>
          <p className="text-[10px] text-white/60">-30% timeline impact</p>
        </div>
      </CardContent>
    </Card>
  )
}