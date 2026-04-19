import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowRight, Sparkles, Briefcase, Users, Star, 
  CheckCircle2, Building2, TrendingUp, Activity, 
  BarChart3, LayoutGrid, PieChart, Calendar, 
  Search, UserPlus, ShieldCheck, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function EmployerDashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let data;
  try {
    data = await fetchFromBackend('/users/company/dashboard')
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return (
      <div className="flex h-[80vh] items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-red-500 tracking-tight">System Offline</h1>
          <p className="text-muted-foreground">Unable to connect to the backend core. Please check server status.</p>
        </div>
      </div>
    )
  }

  const { company, analytics, topTalent, recentJobs, recommendedStudents } = data

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'draft': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      case 'closed': return 'text-rose-500 bg-red-500/10 border-red-500/20'
      default: return 'text-muted-foreground bg-muted/50 border-border'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500'
    if (score >= 75) return 'text-indigo-400'
    if (score >= 60) return 'text-amber-500'
    return 'text-rose-500'
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return '[&>div]:bg-emerald-500 bg-emerald-500/10'
    if (score >= 75) return '[&>div]:bg-indigo-400 bg-indigo-500/10'
    if (score >= 60) return '[&>div]:bg-amber-500 bg-amber-500/10'
    return '[&>div]:bg-rose-500 bg-rose-500/10'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Building2 className="w-3.5 h-3.5" /> Workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            {company.companyName} <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">HQ</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl">
            AI-driven command center for talent acquisition, requisition management, and pipeline health.
          </p>
        </div>
        <div className="flex gap-3">
            <Link href="/employer/jobs/new">
                <div className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
                    <Zap className="w-4 h-4" /> New Requisition
                </div>
            </Link>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Requisitions', value: analytics.activeJobs, total: analytics.totalJobs, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Total Candidates', value: analytics.totalApplications, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'High Match (>80%)', value: analytics.highMatchCandidates, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Pipeline Velocity', value: 'High', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
        ].map((stat, i) => (
          <Card key={i} className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                    {stat.total && <span className="text-sm font-bold text-muted-foreground">/ {stat.total}</span>}
                  </div>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Content - Application Ranker */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* AI Ranker Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-400" /> AI Candidate Ranker
              </h2>
              <Badge variant="outline" className="h-6 font-bold bg-indigo-500/5 text-indigo-400 border-indigo-500/20 uppercase text-[9px] tracking-widest px-3">Live Analysis</Badge>
            </div>
            
            <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl overflow-hidden">
              {topTalent.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Awaiting Candidates</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      AI generated rankings and skill matrices will appear here once candidates begin applying to your active requisitions.
                    </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {topTalent.map((candidate: any, index: number) => (
                    <div key={candidate.id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        
                        {/* Rank & Basic Info */}
                        <div className="flex items-center gap-4 min-w-[240px]">
                          <div className="w-10 h-10 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center font-black text-lg text-muted-foreground group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors shrink-0">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight truncate">{candidate.studentName}</h3>
                            <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">{candidate.jobTitle}</p>
                          </div>
                        </div>

                        {/* Detailed Scores Grid */}
                        <div className="flex-1 grid grid-cols-4 gap-4 px-4 border-l border-white/5">
                          {[
                            { label: 'Skills', val: candidate.skillScore },
                            { label: 'Experience', val: candidate.expScore },
                            { label: 'Projects', val: candidate.projScore },
                            { label: 'Potential', val: candidate.potentialScore }
                          ].map((score, i) => (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between items-end">
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{score.label}</span>
                                  <span className="text-xs font-black">{score.val}</span>
                              </div>
                              <Progress value={score.val} className={`h-1.5 ${getProgressColor(score.val)}`} />
                            </div>
                          ))}
                        </div>

                        {/* Overall Match & Action */}
                        <div className="flex items-center justify-between md:justify-end gap-6 min-w-[140px] pl-4 border-l border-white/5">
                          <div className="text-right">
                            <div className={cn("text-3xl font-black leading-none", getScoreColor(candidate.matchScore))}>
                              {candidate.matchScore}<span className="text-lg text-muted-foreground ml-0.5">%</span>
                            </div>
                            <div className="text-[9px] tracking-[0.2em] uppercase font-black text-muted-foreground mt-1">Match Index</div>
                          </div>
                          <Link href={`/employer/candidates/${candidate.id}`}>
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all shadow-lg hover:shadow-indigo-500/25">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </Link>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* AI Candidate Sourcing (Recommended Students) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-emerald-400" /> AI Candidate Sourcing
                </h2>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase text-[9px] font-black tracking-widest">Global Talent Pool</Badge>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedStudents.map((student: any) => (
                <Card key={student.id} className="bg-background/40 backdrop-blur-xl border-white/5 hover:border-emerald-500/30 transition-all group overflow-hidden">
                   <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                           <h3 className="font-bold text-lg">{student.name}</h3>
                           <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{student.primarySkill}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                           <Star className="w-4 h-4 text-emerald-400 fill-current" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                         {student.skills.slice(0, 4).map((skill: string, i: number) => (
                           <Badge key={i} variant="secondary" className="bg-white/5 text-[9px] font-bold uppercase tracking-tighter">
                             {skill}
                           </Badge>
                         ))}
                         {student.skills.length > 4 && <span className="text-[9px] text-muted-foreground font-black ml-1">+{student.skills.length - 4} MORE</span>}
                      </div>
                      <Link href={`/portfolio/${student.slug}`}>
                        <Button className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all h-10">
                          Recruit Talent
                          <ArrowRight className="ml-2 w-3.5 h-3.5" />
                        </Button>
                      </Link>
                   </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-10">
          
          {/* Recent Jobs */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-cyan-400" /> Recent Jobs
              </h2>
              <Link href="/employer/jobs" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentJobs?.length === 0 ? (
                <Card className="bg-background/40 border-white/5 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground text-sm">
                    No requisitions created yet.
                  </CardContent>
                </Card>
              ) : (
                recentJobs?.map((job: any) => (
                  <Link key={job.id} href={`/employer/jobs/${job.id}/edit`}>
                    <Card className="bg-background/40 backdrop-blur-xl border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer">
                      <CardContent className="p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold leading-tight line-clamp-2">{job.title}</h3>
                          <Badge variant="outline" className={cn("h-5 text-[10px] font-black uppercase tracking-widest px-2 py-0 border shrink-0", getStatusColor(job.status))}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-3 border-t border-white/5">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span className="text-foreground font-bold">{job.applicantsCount}</span> Applicants
                          </div>
                          <div className="opacity-60">{new Date(job.createdAt).toLocaleDateString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Insights - Skill Distribution */}
          <div className="space-y-6">
             <h2 className="text-2xl font-black flex items-center gap-2">
                <PieChart className="w-6 h-6 text-purple-400" /> Talent Insights
             </h2>
             <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl">
                <CardHeader className="p-6 pb-2">
                   <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">In-Demand Skills</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                   {Object.entries(analytics.skillDistribution as Record<string, number>)
                     .sort(([, a], [, b]) => b - a)
                     .slice(0, 5)
                     .map(([skill, count], i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                             <span>{skill}</span>
                             <span className="text-muted-foreground">{count} Candidates</span>
                          </div>
                          <Progress 
                            value={(count / analytics.totalApplications) * 100} 
                            className="h-1 bg-white/5 [&>div]:bg-purple-500" 
                          />
                       </div>
                   ))}
                </CardContent>
             </Card>
          </div>

          {/* Next Steps / Interview Mgt CTA */}
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                  <Calendar size={150} fill="white" />
              </div>
              <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    Interview Hub <ShieldCheck className="w-5 h-5 text-blue-200" />
                  </h3>
                  <p className="text-blue-100 font-medium leading-relaxed">
                      AI-assisted interviewing tools are ready. Screen candidates faster with automated behavioral analysis.
                  </p>
                  <Link href="/employer/interviews">
                    <Button 
                        className="w-full rounded-2xl h-14 bg-white text-indigo-600 hover:bg-blue-50 font-black px-8 mt-4 shadow-xl"
                    >
                        Manage Interviews
                        <ArrowRight className="ml-2 w-4 h-4 fill-current" />
                    </Button>
                  </Link>
              </div>
          </div>

        </div>
      </div>
    </div>
  )
}
