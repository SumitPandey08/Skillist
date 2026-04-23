'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, PlayCircle, Code2, ArrowRight } from 'lucide-react'

interface SmartLearningFeedProps {
  careerRecommendation?: any
}

export function SmartLearningFeed({ careerRecommendation }: SmartLearningFeedProps) {
  const actionPlan = careerRecommendation ? JSON.parse(careerRecommendation.careerRecommendation ? careerRecommendation.careerRecommendation.actionPlan : careerRecommendation.actionPlan) : []
  
  const recommendations = actionPlan.slice(0, 2).map((item: any) => ({
    title: item.step,
    resource: item.resource,
    type: item.priority === 'High' ? 'Build This' : 'Watch This'
  }))

  // Defaults if no recommendations
  if (recommendations.length === 0) {
    recommendations.push(
      { title: 'Node.js API Design Patterns', resource: '15 min read', type: 'Watch This' },
      { title: 'Real-time Chat App', resource: '+15% Match Score', type: 'Build This' }
    )
  }

  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-lg rounded-[2rem] overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> AI Learning Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec: any, idx: number) => (
          <div key={idx} className={cn(
            "p-4 rounded-2xl bg-muted/30 border border-border/40 transition-all cursor-pointer group",
            rec.type === 'Build This' ? "hover:border-primary/30" : "hover:border-amber-500/30"
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-xl shrink-0",
                rec.type === 'Build This' ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
              )}>
                {rec.type === 'Build This' ? <Code2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className={cn(
                  "text-[10px] font-black uppercase mb-1",
                  rec.type === 'Build This' ? "text-primary" : "text-amber-500"
                )}>{rec.type}</p>
                <h4 className={cn(
                  "text-sm font-bold transition-colors",
                  rec.type === 'Build This' ? "group-hover:text-primary" : "group-hover:text-amber-500"
                )}>{rec.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {rec.resource} <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

import { cn } from '@/lib/utils'

