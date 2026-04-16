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
    <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 border border-border/30 shadow-sm">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Trophy className="w-48 h-48 text-primary" />
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold">
            <Star className="w-3 h-3 fill-primary" /> Student Hub
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            Welcome back, <span className="text-primary">{studentName || 'Explorer'}</span>.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your profile is <span className="font-semibold text-primary">{score}% complete</span>. A stronger profile leads to better AI matching.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/jobs">
              <AnimatedButton className="h-10 px-6 text-sm">
                Explore Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </Link>
            {slug && (
              <SharePortfolio slug={slug} />
            )}
          </div>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
          <div className="p-5 rounded-2xl bg-background/60 border border-border/30 flex flex-col items-center justify-center text-center group hover:border-primary/40 transition-all duration-200">
            <div className="p-2 rounded-xl bg-primary/10 mb-2 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{skillsCount}</div>
            <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mt-0.5">Skills</div>
          </div>
          <div className="p-5 rounded-2xl bg-background/60 border border-border/30 flex flex-col items-center justify-center text-center group hover:border-indigo-500/40 transition-all duration-200">
            <div className="p-2 rounded-xl bg-indigo-500/10 mb-2 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold">{certsCount}</div>
            <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mt-0.5">Certs</div>
          </div>
        </div>
      </div>
    </div>
  )
}
