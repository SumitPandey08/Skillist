import { Star, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { AnimatedButton } from '@/components/ui/animated-button'
import { SharePortfolio } from '@/components/dashboard/share-portfolio'
import { Code2, GraduationCap } from 'lucide-react'

interface HeroSectionProps {
  studentName: string
  score: number
  skillsCount: number
  certsCount: number
  slug?: string | null
}

export function HeroSection({ studentName, score, skillsCount, certsCount, slug }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden p-6 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-indigo-500/10 border border-primary/10 shadow-sm group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
        <Trophy className="w-64 h-64 text-primary" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side: Welcome Info */}
        <div className="space-y-5 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest shadow-sm">
            <Star className="w-3.5 h-3.5 fill-primary" /> Intelligence Dashboard
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              Welcome, <span className="text-primary">{studentName || 'Explorer'}</span>.
            </h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
              Your career profile is performing at <span className="text-primary font-bold">{score}% strength</span>. Complete tasks to unlock elite opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <Link href="/jobs">
              <AnimatedButton className="h-12 px-8 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20">
                Match Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </Link>
            {slug && (
              <SharePortfolio slug={slug} />
            )}
          </div>
        </div>
        
        {/* Right Side: Visual Metrics */}
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto">
          {/* Circular Progress Gauge */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-muted/30 fill-none"
                    strokeWidth="10"
                />
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-primary fill-none transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray="283%"
                    strokeDashoffset={`${283 - (283 * score) / 100}%`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl md:text-4xl font-black tracking-tighter">{score}%</span>
                <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-tighter">Strength</span>
            </div>
            {/* Glowing background for the gauge */}
            <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 rounded-full scale-75" />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0">
            <div className="p-5 rounded-2xl bg-background/60 backdrop-blur-md border border-border/40 flex flex-col items-center justify-center text-center group/card hover:border-primary/40 transition-all duration-300 shadow-sm">
                <div className="p-2.5 rounded-xl bg-primary/10 mb-2 group-hover/card:scale-110 transition-transform shadow-inner">
                <Code2 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-black">{skillsCount}</div>
                <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">Skills</div>
            </div>
            <div className="p-5 rounded-2xl bg-background/60 backdrop-blur-md border border-border/40 flex flex-col items-center justify-center text-center group/card hover:border-indigo-500/40 transition-all duration-300 shadow-sm">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 mb-2 group-hover/card:scale-110 transition-transform shadow-inner">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="text-2xl font-black">{certsCount}</div>
                <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">Certs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
