import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { notFound, redirect } from 'next/navigation'
import { ScoreRadarChart } from '@/components/jobs/score-radar-chart'
import { 
  ArrowLeft, Mail, ExternalLink, Brain, 
  Sparkles, CheckCircle2, User, Building2, 
  Briefcase, Zap, Star, ShieldCheck, 
  Code2, ArrowRight
} from 'lucide-react'
import { Github } from '@/components/icons'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusSelect } from '@/components/jobs/status-select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default async function ApplicantDetailPage(
  props: { params: Promise<{ appId: string }> }
) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { appId } = await props.params

  let application;
  try {
    application = await fetchFromBackend(`/jobs/applications/${appId}`)
  } catch (error) {
    console.error('Failed to fetch application:', error)
    notFound()
  }

  const { job, student } = application
  const studentUser = student.user

  const chartData = {
    skills: application.skillScore || 0,
    experience: application.expScore || 0,
    projects: application.projScore || 0,
    potential: application.potentialScore || 0,
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500'
    if (score >= 75) return 'text-indigo-400'
    if (score >= 60) return 'text-amber-500'
    return 'text-rose-500'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 p-8">
      
      {/* Navigation Header */}
      <div className="space-y-6">
        <Link href={`/employer`} className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-indigo-400 transition-colors w-fit">
          <ArrowLeft className="h-3 w-3 mr-2" /> Back to HQ
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" /> Requisition Review
            </div>
            <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                    {student.name}
                </h1>
                <p className="text-xl text-muted-foreground font-medium flex items-center gap-2">
                    {student.primarySkill} <span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Applied for <span className="text-indigo-400 font-bold">{job.title}</span>
                </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
               <Badge className="bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 transition-colors px-3 py-1 gap-2 font-bold uppercase text-[9px] tracking-widest">
                  <Mail className="h-3 w-3" /> {studentUser?.email}
               </Badge>
               {student.githubUrl && (
                  <a href={student.githubUrl} target="_blank" rel="noopener">
                    <Badge className="bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 transition-colors px-3 py-1 gap-2 font-bold uppercase text-[9px] tracking-widest">
                        <Github className="h-3 w-3" /> GitHub
                    </Badge>
                  </a>
               )}
               {student.linkedinUrl && (
                  <a href={student.linkedinUrl} target="_blank" rel="noopener">
                    <Badge className="bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 transition-colors px-3 py-1 gap-2 font-bold uppercase text-[9px] tracking-widest">
                        <User className="h-3 w-3" /> LinkedIn
                    </Badge>
                  </a>
               )}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-background/40 backdrop-blur-xl p-2 rounded-[2rem] border border-white/5 shadow-2xl">
             {student.resumeUrl && (
                <a href={student.resumeUrl} target="_blank" rel="noopener">
                    <div className="h-14 px-8 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-3 transition-all shadow-lg shadow-indigo-500/20">
                        <ExternalLink className="w-5 h-5" /> View Resume
                    </div>
                </a>
             )}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-12">
        
        {/* Left Column - Scoring and Details */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* Match Score Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden group">
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Match Matrix</div>
                        <Brain className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex items-end gap-2">
                        <span className={cn("text-7xl font-black tracking-tighter leading-none", getScoreColor(application.matchScore))}>
                            {application.matchScore}
                        </span>
                        <span className="text-2xl font-black text-muted-foreground/40 mb-1">%</span>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Update Pipeline Status</p>
                        <StatusSelect appId={appId} currentStatus={application.status} />
                    </div>
                </div>
             </Card>

             <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Competency Radar</div>
                   <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div className="h-48 flex items-center justify-center">
                    <ScoreRadarChart data={chartData} />
                </div>
             </Card>
          </div>

          {/* AI Reasoning Section */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-indigo-400" /> AI Match Reasoning
                </h2>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase text-[9px] font-black tracking-widest px-3 py-1">Deep Analysis</Badge>
             </div>
             
             <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl">
                <CardContent className="p-10">
                   <div className="relative">
                      <div className="absolute -top-4 -left-4 text-6xl text-white/5 font-serif italic">"</div>
                      <p className="text-xl font-medium leading-relaxed italic text-foreground relative z-10">
                        {application.analysis || "The neural engine is still processing this candidate's history. Check back in a few seconds for a complete breakdown."}
                      </p>
                      <div className="absolute -bottom-8 -right-4 text-6xl text-white/5 font-serif italic">"</div>
                   </div>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-10 border-t border-white/5">
                      {[
                        { label: 'Technical Depth', val: application.skillScore },
                        { label: 'Market Tenure', val: application.expScore },
                        { label: 'Execution', val: application.projScore },
                        { label: 'Adaptability', val: application.potentialScore }
                      ].map((stat, i) => (
                        <div key={i} className="space-y-3">
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                           <div className="text-2xl font-black">{stat.val}%</div>
                           <Progress value={stat.val} className="h-1 [&>div]:bg-indigo-400 bg-white/5" />
                        </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Professional Context */}
          <div className="space-y-6">
             <h2 className="text-2xl font-black flex items-center gap-3">
               <User className="w-6 h-6 text-cyan-400" /> Professional Context
             </h2>
             <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl p-10">
                <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                   {student.bio || "No professional narrative provided by the candidate."}
                </p>
             </Card>
          </div>
        </div>

        {/* Right Column - Actions & Sidebar */}
        <div className="xl:col-span-4 space-y-8">
           
           <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                  <Code2 size={150} fill="white" />
              </div>
              <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Recruit Directly</h3>
                    <p className="text-indigo-100 font-medium leading-relaxed opacity-90">
                        Initiate a direct technical screening session or interview with this candidate.
                    </p>
                  </div>
                  <Button 
                      className="w-full rounded-2xl h-14 bg-white text-indigo-600 hover:bg-indigo-50 font-black px-8 shadow-xl gap-2"
                  >
                      Schedule Interview
                      <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                      variant="ghost"
                      className="w-full rounded-2xl h-14 border-white/20 hover:bg-white/10 text-white font-black px-8"
                  >
                      Invite to Test
                  </Button>
              </div>
           </div>

           <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Candidate Origin</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 text-amber-400" />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Top Match</p>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Match &gt; 80% Tier</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                     </div>
                     <div>
                        <p className="text-sm font-bold">External Verification</p>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">GitHub + LeetCode Validated</p>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Applied Date</span>
                        <span className="text-xs font-bold">{new Date(application.createdAt).toLocaleDateString()}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Current Status</span>
                        <Badge variant="outline" className="text-[9px] font-black uppercase px-2 py-0 h-5 border-indigo-500/30 text-indigo-400">{application.status}</Badge>
                     </div>
                  </div>
              </CardContent>
           </Card>

        </div>
      </div>
    </div>
  )
}
