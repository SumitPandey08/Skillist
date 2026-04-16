'use client'

import { useState } from 'react'
import { auth } from '@clerk/nextjs/server'
import { db, eq, userScores, students, studentSkills, skills } from '@/db'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, BarChart3, TrendingUp, Zap, Target, AlertCircle, Loader2, ArrowRight, Brain, Clock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { triggerSkillAnalysis } from '@/app/dashboard/student/_actions'
import { useRouter } from 'next/navigation'

interface ScoreData {
  overallScore: number | null
  proficiencyScore: number | null
  problemSolvingScore: number | null
  projectQualityScore: number | null
  consistencyScore: number | null
  insights: string | null
}

interface StudentData {
  primarySkill: string | null
}

interface Skill {
  name: string
  proficiency: number
}

interface AnalysisClientProps {
  scores: ScoreData
  student: StudentData | null
  skills: Skill[]
}

export function AnalysisClient({ scores: initialScores, student, skills: userSkills }: AnalysisClientProps) {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scores, setScores] = useState(initialScores)
  const [selectedRole, setSelectedRole] = useState(student?.primarySkill || 'Frontend Developer')

  const insights = scores?.insights ? JSON.parse(scores.insights) : null

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const currentSkills = userSkills.map(s => s.name)
      await triggerSkillAnalysis(selectedRole, currentSkills)
      router.refresh()
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-400'
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number | null) => {
    if (!score) return 'N/A'
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Average'
    return 'Needs Work'
  }

  const roles = [
    'Frontend Developer',
    'Backend Developer', 
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Product Manager',
    'UI/UX Designer'
  ]

  return (
    <StudentDashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" /> Talent Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Skill <span className="text-purple-600">Analysis</span></h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Deep insights into your professional DNA. Our AI analyzes your skills, projects, and market data.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-12 px-4 rounded-full border border-border bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="rounded-full h-12 px-6 font-black gap-2 bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-500/20 group transition-all duration-300"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-current group-hover:animate-pulse" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Re-calculate'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
            <Card className="md:col-span-2 row-span-2 overflow-hidden border-none bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl shadow-purple-500/20 rounded-[2.5rem] relative">
                <div className="absolute -bottom-10 -right-10 opacity-10">
                    <TrendingUp className="w-64 h-64" />
                </div>
                <CardHeader className="p-10 pb-0">
                    <CardTitle className="text-purple-100 text-sm font-bold uppercase tracking-[0.2em]">Overall Market Fit</CardTitle>
                    <div className="text-8xl font-black mt-4 flex items-baseline gap-2">
                        {scores?.overallScore || 0}
                        <span className="text-2xl text-purple-200/60">%</span>
                    </div>
                </CardHeader>
                <CardContent className="p-10 pt-8">
                    <p className="text-purple-100/80 leading-relaxed text-lg font-medium">
                        Your skills are competitive for <span className="text-white font-bold">{selectedRole}</span> roles. 
                        {scores?.overallScore && scores.overallScore >= 70 
                          ? ` You rank in the top ${Math.max(5, 30 - Math.floor(scores.overallScore / 5))}% of candidates.`
                          : ' Keep building your skills to improve your market fit.'
                        }
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Badge className={scores?.overallScore && scores.overallScore >= 70 ? "bg-emerald-500/30 text-emerald-100 border-emerald-400/50" : "bg-white/20 text-white border-none"}>
                            {getScoreLabel(scores?.overallScore)}
                        </Badge>
                        {scores?.overallScore && scores.overallScore >= 60 && (
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">Ready for Interview</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/40 bg-background/60 backdrop-blur-md rounded-[2rem] shadow-sm">
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Brain className="w-3 h-3" /> Proficiency
                    </CardTitle>
                    <div className="text-3xl font-black mt-1">{scores?.proficiencyScore || 0}%</div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden">
                        <div className={`h-full ${getScoreColor(scores?.proficiencyScore)} rounded-full transition-all duration-500`} style={{ width: `${scores?.proficiencyScore || 0}%` }} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/40 bg-background/60 backdrop-blur-md rounded-[2rem] shadow-sm">
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="w-3 h-3" /> Problem Solving
                    </CardTitle>
                    <div className="text-3xl font-black mt-1">{scores?.problemSolvingScore || 0}%</div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden">
                        <div className={`h-full ${getScoreColor(scores?.problemSolvingScore)} rounded-full transition-all duration-500`} style={{ width: `${scores?.problemSolvingScore || 0}%` }} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/40 bg-background/60 backdrop-blur-md rounded-[2rem] shadow-sm">
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Star className="w-3 h-3" /> Project Quality
                    </CardTitle>
                    <div className="text-3xl font-black mt-1">{scores?.projectQualityScore || 0}%</div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden">
                        <div className={`h-full ${getScoreColor(scores?.projectQualityScore)} rounded-full transition-all duration-500`} style={{ width: `${scores?.projectQualityScore || 0}%` }} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/40 bg-background/60 backdrop-blur-md rounded-[2rem] shadow-sm">
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Consistency
                    </CardTitle>
                    <div className="text-3xl font-black mt-1">{scores?.consistencyScore || 0}%</div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden">
                        <div className={`h-full ${getScoreColor(scores?.consistencyScore)} rounded-full transition-all duration-500`} style={{ width: `${scores?.consistencyScore || 0}%` }} />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-purple-600" /> Gap Analysis
                </h2>
                <div className="grid gap-4">
                    {insights?.gapAnalysis && insights.gapAnalysis.length > 0 ? (
                        insights.gapAnalysis.map((gap: any, idx: number) => (
                            <Card key={idx} className="border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <Target className="w-4 h-4 text-purple-600" /> {gap.skill}
                                        </h3>
                                        <Badge variant="outline" className="text-xs">Priority</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                        <span className="font-bold text-foreground">Gap:</span> {gap.gap}
                                    </p>
                                    <div className="mt-4 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                        <p className="text-sm text-purple-600 font-bold">
                                            Recommendation: {gap.recommendation}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-8 text-center border-dashed border-2">
                            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">Run a skill analysis to see your growth areas.</p>
                            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="mt-4 rounded-full">
                                {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                            </Button>
                        </Card>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" /> Suggested Roles
                </h2>
                <div className="flex flex-wrap gap-3">
                    {insights?.suggestedRoles && insights.suggestedRoles.length > 0 ? (
                        insights.suggestedRoles.map((role: string, idx: number) => (
                            <Badge key={idx} className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20 px-6 py-3 rounded-2xl text-lg font-black transition-all cursor-default flex items-center gap-2">
                                {role}
                                <ArrowRight className="w-4 h-4" />
                            </Badge>
                        ))
                    ) : (
                        <p className="text-muted-foreground p-4">Perform an analysis to see your best matching roles.</p>
                    )}
                </div>

                <div className="mt-8 p-8 rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <Zap className="w-32 h-32" />
                    </div>
                    <h3 className="text-2xl font-black">AI Recommendations</h3>
                    <p className="text-indigo-100/80 mt-2 font-medium">
                        Based on your profile, start a <span className="underline decoration-white underline-offset-4">System Design Interview</span> session to improve your problem-solving score.
                    </p>
                    <Button 
                        className="mt-6 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 font-black px-8"
                        onClick={() => router.push('/dashboard/student/interviews')}
                    >
                        Start Interview Practice
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-border/30">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Your Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {userSkills.length > 0 ? (
                            userSkills.map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="py-2 px-4">
                                    {skill.name}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No skills added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}