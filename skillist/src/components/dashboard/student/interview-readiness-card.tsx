'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Bot, Mic, ArrowRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { AnimatedButton } from '@/components/ui/animated-button'
import Link from 'next/link'

interface InterviewReadinessCardProps {
  mockInterviews?: any[]
}

export function InterviewReadinessCard({ mockInterviews = [] }: InterviewReadinessCardProps) {
  const lastInterview = mockInterviews[0]
  const score = lastInterview?.score || 65
  const feedback = lastInterview?.feedback || 'Practice more to improve.'
  
  // Extract weak area from feedback if possible
  const weakArea = feedback.includes('communication') ? 'Comm.' : 
                   feedback.includes('technical') ? 'Tech.' : 
                   feedback.includes('logic') ? 'Logic' : 'General'

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 shadow-xl rounded-3xl overflow-hidden relative group">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-foreground">Interview Readiness</h3>
            <p className="text-xs font-bold text-muted-foreground">AI Assessment</p>
          </div>
        </div>

        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-black tracking-tighter">{score}<span className="text-lg text-muted-foreground">%</span></span>
          <span className="text-[10px] font-black uppercase text-rose-500 mb-1 bg-rose-500/10 px-2 py-0.5 rounded-sm">Weak: {weakArea}</span>
        </div>
        
        <Progress value={score} className="h-2 mb-6 bg-purple-500/20 [&>div]:bg-purple-600" />

        <Link href="/dashboard/student/interviews">
          <AnimatedButton className="w-full h-10 text-xs font-bold gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25">
            <Mic className="w-3.5 h-3.5" /> Start Mock Interview
          </AnimatedButton>
        </Link>
      </CardContent>
    </Card>
  )
}
