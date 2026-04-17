'use client'

import * as React from 'react'
import { CheckCircle2, Target, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface ProfileCompletenessProps {
  score: number
  missing: string[]
}

export function ProfileCompleteness({ score, missing }: ProfileCompletenessProps) {
  // Map missing task strings to their respective navigation paths and labels
  const getTaskLink = (task: string) => {
    if (task.toLowerCase().includes('bio')) return { href: '/profile', label: 'Complete Bio' }
    if (task.toLowerCase().includes('skill')) return { href: '/dashboard/student/portfolio#skills', label: 'Add Skills' }
    if (task.toLowerCase().includes('project')) return { href: '/dashboard/student/portfolio#projects', label: 'Add Projects' }
    if (task.toLowerCase().includes('certification')) return { href: '/dashboard/student/portfolio#certifications', label: 'Add Certs' }
    return { href: '/dashboard/student/portfolio', label: 'Update Profile' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-black flex items-center gap-2 tracking-tight">
            <Target className="w-5 h-5 text-primary" /> Profile Score
          </h3>
          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">AI Matching Strength</p>
        </div>
        <div className="text-3xl font-black text-primary drop-shadow-sm">{score}%</div>
      </div>

      <div className="relative h-3 w-full bg-muted/40 rounded-full overflow-hidden border border-border/50 p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-primary via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-4">
        {missing.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Urgent Level Up Tasks</p>
                <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-black bg-primary/5 text-primary border-primary/20">{missing.length} Left</Badge>
            </div>
            
            <div className="grid gap-2">
              {missing.map((item, idx) => {
                const { href, label } = getTaskLink(item)
                return (
                    <Link key={idx} href={href}>
                        <div className="group flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 hover:bg-muted/50 transition-all duration-200">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0" />
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{item}</p>
                                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-tighter group-hover:text-primary transition-colors">{label}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </Link>
                )
              })}
            </div>
            
            <div className="p-3 rounded-xl bg-primary/5 border border-dashed border-primary/20 text-center">
                <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed italic">
                  Complete these tasks to increase your visibility to recruiters by up to <span className="text-primary font-black">40%</span>.
                </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-emerald-600">Peak Performance</p>
              <p className="text-xs font-medium text-emerald-600/70 leading-tight">Your profile is fully optimized for our AI matching engine.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
