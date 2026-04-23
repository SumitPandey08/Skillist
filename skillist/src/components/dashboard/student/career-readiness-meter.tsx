'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, ChevronRight } from 'lucide-react'

export function CareerReadinessMeter({ score = 70 }: { score?: number }) {
  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 shadow-xl rounded-[2rem] overflow-hidden relative group cursor-pointer">
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
      
      <CardContent className="p-6 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600/80 mb-1">Career Readiness</h3>
            <p className="text-lg font-black tracking-tight leading-none text-foreground">
              You are <span className="text-emerald-500">{score}%</span> job-ready
            </p>
          </div>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-600">
          <ChevronRight className="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  )
}
