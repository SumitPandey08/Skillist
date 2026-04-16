'use client'

import * as React from 'react'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Target } from 'lucide-react'

interface ProfileCompletenessProps {
  score: number
  missing: string[]
}

export function ProfileCompleteness({ score, missing }: ProfileCompletenessProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Profile Score
          </h3>
          <p className="text-xs text-muted-foreground/70">AI Matching Strength</p>
        </div>
        <div className="text-3xl font-bold text-primary">{score}%</div>
      </div>

      <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-700 ease-out" 
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-3">
        {missing.length > 0 ? (
          <>
            <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">Level Up Tasks</p>
            <ul className="grid gap-2">
              {missing.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="mt-0.5 w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-center text-muted-foreground/50">
              Complete these to increase visibility
            </p>
          </>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-green-600">Peak Performance</p>
              <p className="text-[10px] text-green-600/70">Profile optimized for AI visibility</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
