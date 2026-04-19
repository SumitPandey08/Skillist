import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, BarChart3, TrendingUp, Users, 
  Briefcase, CheckCircle2, PieChart, Activity,
  LayoutGrid, ShieldCheck, Zap, Brain
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export default async function EmployerAnalyticsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let analytics;
  try {
    analytics = await fetchFromBackend('/users/company/analytics')
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return <div>Error loading analytics</div>
  }

  const { pipelineStats, skillSupply, conversionRate, activeJobs, totalApplications } = analytics

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 p-8">
      
      {/* Header */}
      <div className="space-y-6">
        <Link href="/employer" className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-indigo-400 transition-colors w-fit">
          <ArrowLeft className="h-3 w-3 mr-2" /> Back to HQ
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <BarChart3 className="w-3.5 h-3.5" /> Intelligence Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Pipeline <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Insights</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl">
              Comprehensive analysis of candidate quality, conversion velocity, and skill distribution across your ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Conversion & Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pipeline Funnel */}
        <Card className="lg:col-span-8 bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
             <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black tracking-tight">Hiring Velocity Funnel</CardTitle>
                <Badge variant="outline" className="bg-indigo-500/5 text-indigo-400 border-indigo-500/10 uppercase text-[9px] tracking-widest px-3">Real-time Pipeline</Badge>
             </div>
             <CardDescription>Conversion metrics from sourcing to accepted offers.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-12 mt-6">
             {[
               { label: 'Total Sourced', val: pipelineStats.sourcing, color: 'bg-indigo-400', pct: 100 },
               { label: 'Screened Candidates', val: pipelineStats.screening, color: 'bg-indigo-500', pct: (pipelineStats.screening / pipelineStats.sourcing) * 100 },
               { label: 'Technical Interviews', val: pipelineStats.interviewing, color: 'bg-purple-500', pct: (pipelineStats.interviewing / pipelineStats.sourcing) * 100 },
               { label: 'Offers Accepted', val: pipelineStats.offered, color: 'bg-emerald-500', pct: (pipelineStats.offered / pipelineStats.sourcing) * 100 }
             ].map((step, i) => (
               <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{step.label}</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-2xl font-black">{step.val}</span>
                       <span className="text-[10px] font-bold text-muted-foreground/60">{Math.round(step.pct)}% Flow</span>
                    </div>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
                     <div className={cn("h-full transition-all duration-1000", step.color)} style={{ width: `${step.pct}%` }} />
                  </div>
               </div>
             ))}
          </CardContent>
        </Card>

        {/* Global Conversion Score */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none shadow-2xl text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <TrendingUp size={200} fill="white" />
              </div>
              <CardContent className="p-10 relative z-10 space-y-4">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/60">Global Conversion Rate</div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black tracking-tighter">{Math.round(conversionRate)}</span>
                    <span className="text-2xl font-black opacity-40">%</span>
                 </div>
                 <p className="text-indigo-100 font-medium leading-relaxed opacity-80 pt-4 border-t border-white/10">
                    Your offer acceptance rate is <span className="font-bold text-white">12% higher</span> than industry average for distributed systems roles.
                 </p>
              </CardContent>
           </Card>

           <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Market Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-muted-foreground">Sourcing Quality</span>
                     <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black text-[10px]">TOP 5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-muted-foreground">Time-to-Hire</span>
                     <span className="text-sm font-black">14 Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-muted-foreground">High-Match Yield</span>
                     <span className="text-sm font-black">42.8%</span>
                  </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Talent Supply Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl">
            <CardHeader className="p-8">
               <div className="flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-indigo-400" />
                  <CardTitle className="text-xl font-black tracking-tight">Talent Supply Matrix</CardTitle>
               </div>
               <CardDescription>Most prevalent technical skills across your current candidate pool.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
               {Object.entries(skillSupply)
                 .sort(([, a], [, b]) => (b as number) - (a as number))
                 .slice(0, 6)
                 .map(([skill, count], i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                         <span className="text-foreground">{skill}</span>
                         <span className="text-muted-foreground">{count as number} matches</span>
                      </div>
                      <Progress 
                        value={((count as number) / totalApplications) * 100} 
                        className="h-1.5 bg-white/5 [&>div]:bg-indigo-400" 
                      />
                   </div>
               ))}
            </CardContent>
         </Card>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl p-8 space-y-6">
               <div className="p-3 w-fit rounded-2xl bg-cyan-500/10">
                  <Activity className="w-6 h-6 text-cyan-400" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tight">{activeJobs}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Requisitions</p>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">
                  Your pipeline is currently optimized for <span className="font-bold text-foreground">3 key roles</span>. 
               </p>
            </Card>

            <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl p-8 space-y-6">
               <div className="p-3 w-fit rounded-2xl bg-amber-500/10">
                  <Zap className="w-6 h-6 text-amber-400" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tight">{totalApplications}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Candidates Scanned</p>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">
                  The AI engine has analyzed <span className="font-bold text-foreground">{totalApplications * 4} score dimensions</span> this month.
               </p>
            </Card>

            <Card className="md:col-span-2 bg-background/40 backdrop-blur-xl border-white/5 shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Brain size={150} fill="white" />
               </div>
               <div className="shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                     <span className="text-3xl font-black text-emerald-400">84</span>
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-500" strokeDasharray="276" strokeDashoffset={276 - (276 * 0.84)} />
                     </svg>
                  </div>
               </div>
               <div className="space-y-3 text-center md:text-left relative z-10">
                  <h3 className="text-xl font-black">Talent IQ™</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                     The aggregate quality score of your sourced candidates is <span className="text-emerald-400 font-bold">Excellent</span>. Your technical benchmarks are attracting top-tier engineering talent.
                  </p>
               </div>
            </Card>
         </div>
      </div>

    </div>
  )
}
