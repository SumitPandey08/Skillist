'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Compass, TrendingUp, Sparkles, Target, ArrowRight, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedButton } from '@/components/ui/animated-button'
import Link from 'next/link'

interface CareerPathWidgetProps {
  intent: string
  currentGrade: string
  primarySkill: string
}

export function CareerPathWidget({ intent, currentGrade, primarySkill }: CareerPathWidgetProps) {
  const isExplorer = intent === 'explore'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-2 border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 shadow-lg rounded-[2rem]">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section: Intent Status */}
            <div className="p-8 lg:p-10 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-primary/10 bg-primary/[0.02]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                  {isExplorer ? <Compass className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {isExplorer ? 'Discovery Mode' : 'Advancement Mode'}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">
                    {isExplorer ? 'Finding Your Edge' : 'Dominating Your Field'}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Level: <span className="text-foreground font-bold">{currentGrade}</span>
                  </p>
                </div>

                <div className="pt-4">
                   <div className="p-4 rounded-2xl bg-background border border-border/40 shadow-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Focus</span>
                      </div>
                      <p className="text-sm font-bold text-primary">{primarySkill || 'Not set'}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Section: AI Recommendations */}
            <div className="p-8 lg:p-10 flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest">AI Career Insight</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Next steps tailored for you</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/20 hover:border-primary/20 transition-all cursor-pointer group">
                    <h5 className="text-sm font-bold mb-2 group-hover:text-primary transition-colors">
                      {isExplorer ? 'Explore AI Domains' : 'Bridge Tech Gaps'}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isExplorer 
                        ? 'Based on your interest in AI, we recommend exploring LLMs and Vector DBs.' 
                        : 'Your React skills are solid. Mastering Next.js Server Components is your next milestone.'}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/20 hover:border-primary/20 transition-all cursor-pointer group">
                    <h5 className="text-sm font-bold mb-2 group-hover:text-primary transition-colors">
                      {isExplorer ? 'Initial Assessment' : 'Elite Certification'}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isExplorer 
                        ? 'Validate your core logic through our problem-solving assessment.' 
                        : 'Get Skillist Certified in Frontend Architecture to stand out to employers.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-black uppercase">
                          {isExplorer ? 'E' : 'A'}{i}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                        +5
                      </div>
                   </div>
                   <Link href={isExplorer ? "/dashboard/student/assessments" : "/dashboard/student/roadmap"}>
                      <AnimatedButton className="h-11 px-6 rounded-xl text-xs font-bold shadow-lg shadow-primary/10">
                        {isExplorer ? 'Start Exploration' : 'View Roadmap'} <ArrowRight className="ml-2 h-4 w-4" />
                      </AnimatedButton>
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
