import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Calendar, Clock, User, 
  CheckCircle2, PlayCircle, XCircle, 
  ChevronRight, Brain, ShieldCheck, Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function EmployerInterviewsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let interviews = []
  try {
    interviews = await fetchFromBackend('/users/company/interviews')
  } catch (error) {
    console.error('Failed to fetch interviews:', error)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-400" />
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-amber-400 animate-pulse" />
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-rose-400" />
      default: return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'in_progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      default: return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* Header */}
      <div className="mt-8 space-y-6">
        <Link href="/employer" className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-indigo-400 transition-colors w-fit">
          <ArrowLeft className="h-3 w-3 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" /> Interview Command
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Active <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Sessions</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl">
              Monitor candidate performance, review AI-generated feedback, and manage your technical screening pipeline.
            </p>
          </div>
          
          <Button className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/20 transition-all gap-3">
             <Calendar className="w-5 h-5" /> Schedule New Session
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Interview List */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <Clock className="w-6 h-6 text-indigo-400" /> Pipeline Queue
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="h-7 bg-indigo-500/5 text-indigo-400 border-indigo-500/10 font-bold px-3">ALL</Badge>
                <Badge variant="outline" className="h-7 bg-amber-500/5 text-amber-400 border-amber-500/10 font-bold px-3 opacity-50">IN-PROGRESS</Badge>
              </div>
          </div>

          <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
            {interviews.length === 0 ? (
               <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center mx-auto">
                    <Calendar className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-bold">No active interviews</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Scheduled sessions and live technical screenings will appear here for management.
                  </p>
               </div>
            ) : (
              <div className="divide-y divide-white/5">
                {interviews.map((interview: any) => (
                  <div key={interview.id} className="p-8 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                          <User className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-black text-xl tracking-tight">{interview.student.name}</h3>
                            <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border", getStatusBadge(interview.status))}>
                              <span className="flex items-center gap-1.5">
                                {getStatusIcon(interview.status)}
                                {interview.status}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-medium text-sm">Targeting <span className="text-foreground font-bold">{interview.role}</span> for {interview.job?.title || 'General'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-10">
                        <div className="hidden md:block text-right space-y-1">
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scheduled For</div>
                           <div className="font-bold flex items-center gap-2 justify-end">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                              {new Date(interview.scheduledAt || interview.createdAt).toLocaleDateString()}
                           </div>
                        </div>

                        {interview.score && (
                          <div className="text-center space-y-1">
                             <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Score</div>
                             <div className="text-2xl font-black text-emerald-400">{interview.score}%</div>
                          </div>
                        )}

                        <Link href={`/employer/interviews/${interview.id}`}>
                          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all shadow-lg">
                            <ChevronRight className="w-5 h-5" />
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

        {/* Sidebar - AI Insights */}
        <div className="xl:col-span-4 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-400" /> AI Insights
              </h2>
           </div>

           <div className="space-y-4">
              <Card className="bg-background/40 backdrop-blur-xl border-white/5 shadow-xl">
                 <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pipeline Health</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-2 space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold">Avg. Performance</span>
                       <span className="text-emerald-400 font-black">74%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold">Conversion Rate</span>
                       <span className="text-indigo-400 font-black">12.5%</span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                           "Your pipeline is seeing high-quality candidates in Frontend roles, but technical depth in distributed systems remains a gap."
                        </p>
                    </div>
                 </CardContent>
              </Card>

              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                      <Zap size={150} fill="white" />
                  </div>
                  <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-black tracking-tight">Smart Sourcing</h3>
                      <p className="text-emerald-100 font-medium leading-relaxed">
                          Invite the top matched candidates from your pipeline to a technical screening instantly.
                      </p>
                      <Button 
                          className="w-full rounded-2xl h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-black px-8 mt-4 shadow-xl"
                      >
                          Auto-Invite Matches
                          <Zap className="ml-2 w-4 h-4 fill-current" />
                      </Button>
                  </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
