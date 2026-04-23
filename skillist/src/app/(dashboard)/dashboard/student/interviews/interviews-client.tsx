'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, MessageSquare, Play, History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { createMockInterview } from '@/app/dashboard/student/_actions'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'

interface Interview {
  id: string
  role: string
  status: string
  score: number | null
  createdAt: Date
  updatedAt: Date
}

interface StudentData {
  primarySkill: string | null
}

interface InterviewsClientProps {
  interviews: Interview[]
  student: StudentData | null
}

export function InterviewsClient({ interviews: initialInterviews, student }: InterviewsClientProps) {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [showRoleSelect, setShowRoleSelect] = useState(false)
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews)

  const handleStartSession = async (role: string) => {
    setIsStarting(true)
    try {
      const result = await createMockInterview(role)
      router.push(`/candidate/mock-interview?id=${result.id}`)
    } catch (err) {
      console.error('Failed to start interview:', err)
    } finally {
      setIsStarting(false)
      setShowRoleSelect(false)
    }
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Bot className="w-3 h-3" /> AI Simulation
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">AI <span className="text-indigo-600">Interviewer</span></h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Master your interview skills with our agentic AI that adapts to your performance.
            </p>
          </div>
          
          <Button 
            onClick={() => setShowRoleSelect(true)}
            className="rounded-full h-14 px-8 font-black gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 group transition-all duration-300"
            disabled={isStarting}
          >
            {isStarting ? 'Starting...' : 'Start New Session'} <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        {showRoleSelect && (
          <Card className="border-indigo-500/30 bg-indigo-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Select Role for Interview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Product Manager'].map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  className="rounded-full border-indigo-500/30 hover:bg-indigo-500/10"
                  onClick={() => handleStartSession(role)}
                >
                  {role}
                </Button>
              ))}
              <Button variant="ghost" onClick={() => setShowRoleSelect(false)}>Cancel</Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
           <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-500/20 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                 <Bot className="w-24 h-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-white/80 text-sm font-bold uppercase tracking-wider">Average Score</CardTitle>
                <div className="text-4xl font-black mt-2">
                    {interviews.length > 0 
                        ? Math.round(interviews.reduce((acc, i) => acc + (i.score || 0), 0) / interviews.length)
                        : 0}%
                </div>
              </CardHeader>
              <CardContent>
                 <p className="text-xs text-white/60 font-medium">Based on {interviews.length} sessions</p>
              </CardContent>
           </Card>

           <Card className="border-border/40 shadow-sm bg-background/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Sessions This Week</CardTitle>
                <div className="text-4xl font-black mt-2">
                    {interviews.filter(i => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(i.createdAt) > weekAgo;
                    }).length}
                </div>
              </CardHeader>
              <CardContent>
                 <p className="text-xs text-muted-foreground font-medium">Consistency is key</p>
              </CardContent>
           </Card>

           <Card className="border-border/40 shadow-sm bg-background/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Primary Role</CardTitle>
                <div className="text-2xl font-black mt-2 truncate">
                    {student?.primarySkill || 'Not set'}
                </div>
              </CardHeader>
              <CardContent>
                 <p className="text-xs text-muted-foreground font-medium">Focused on your path</p>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
             <History className="w-6 h-6 text-indigo-600" /> Recent Sessions
          </h2>
          
          <div className="grid gap-4">
            {interviews.length > 0 ? (
                interviews.map((interview) => (
                    <Card key={interview.id} className="group hover:border-indigo-500/30 transition-all duration-300 bg-background/40">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/5 text-indigo-600 group-hover:bg-indigo-500/10 transition-colors">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{interview.role}</h3>
                                    <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                                        {new Date(interview.createdAt).toLocaleDateString('en-GB')} at {new Date(interview.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Score</div>
                                    <Badge variant={interview.score && interview.score >= 80 ? "default" : "secondary"} className="font-black text-sm px-3">
                                        {interview.score || 'PENDING'}%
                                    </Badge>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  className="rounded-full group-hover:bg-indigo-500/10 group-hover:text-indigo-600"
                                  onClick={() => router.push(`/candidate/mock-interview?id=${interview.id}`)}
                                >
                                    Review Feedback
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="p-12 text-center rounded-[2rem] border-2 border-dashed border-border/40">
                    <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-bold">No interview sessions yet</h3>
                    <p className="text-muted-foreground mb-6">Start your first session to get AI-powered feedback.</p>
                    <Button variant="outline" className="rounded-full px-8" onClick={() => setShowRoleSelect(true)}>Start First Session</Button>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}