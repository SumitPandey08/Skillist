import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { Compass, TrendingUp, ArrowRight, Sparkles, BrainCircuit } from 'lucide-react'
import { motion } from 'framer-motion'

interface SmartCTAProps {
  intent: 'explore' | 'advance' | string
  isNewUser: boolean
}

export function SmartCTA({ intent, isNewUser }: SmartCTAProps) {
  if (!isNewUser) return null

  const isExplorer = intent === 'explore'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 shadow-xl shadow-primary/5 rounded-[2.5rem]">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          {isExplorer ? <Compass className="w-32 h-32" /> : <TrendingUp className="w-32 h-32" />}
        </div>
        
        <CardContent className="p-8 md:p-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" /> Personalized Path
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                {isExplorer 
                  ? "Not sure where to start your journey?" 
                  : "Ready to dominate your chosen field?"}
              </h3>
              <p className="text-muted-foreground font-medium max-w-xl">
                {isExplorer 
                  ? "Our AI Career Engine analyzes your behavioral traits and interests to suggest the perfect tech roles for you."
                  : "Analyze your current skill set against industry standards to identify gaps and boost your market fit score."}
              </p>
            </div>

            <div className="shrink-0">
              <Link href={isExplorer ? "/dashboard/student/career" : "/dashboard/student/analysis"}>
                <AnimatedButton className="h-14 px-8 rounded-2xl text-base font-bold group shadow-xl shadow-primary/20">
                  {isExplorer ? (
                    <>
                      <Compass className="mr-2 h-5 w-5" /> Launch Career Engine
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="mr-2 h-5 w-5" /> Analyze My Skills
                    </>
                  )}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </CardContent>
        
        {/* Decorative corner glow */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
      </Card>
    </motion.div>
  )
}
