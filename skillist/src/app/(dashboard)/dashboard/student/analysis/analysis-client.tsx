'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, BarChart3, TrendingUp, Zap, Target, AlertCircle, Loader2, ArrowRight, Brain, Clock, Star, ChevronRight, LayoutGrid, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { triggerSkillAnalysis } from '@/app/dashboard/student/_actions'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
  scores: ScoreData | null
  student: StudentData | null
  skills: Skill[]
}

export function AnalysisClient({ scores: initialScores, student, skills: userSkills }: AnalysisClientProps) {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedRole, setSelectedRole] = useState(student?.primarySkill || 'Frontend Developer')
  const [error, setError] = useState<string | null>(null)

  const insights = initialScores?.insights ? JSON.parse(initialScores.insights) : null

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const currentSkills = userSkills.map(s => s.name)
      await triggerSkillAnalysis(selectedRole, currentSkills)
      router.refresh()
    } catch (err: any) {
      console.error('Analysis failed:', err)
      setError(err.message || 'Failed to start analysis. Please check your connection and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return 'bg-gray-400'
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  const getScoreLabel = (score: number | null | undefined) => {
    if (!score) return 'N/A'
    if (score >= 80) return 'Elite Performance'
    if (score >= 60) return 'Market Competitive'
    if (score >= 40) return 'Developing'
    return 'Growth Phase'
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
    <div className="space-y-10 pb-20 px-1 sm:px-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm shadow-purple-500/5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Intelligence Engine v2.0
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-6xl font-black tracking-tight leading-none"
            >
                Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Diagnostics</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-lg sm:text-xl font-medium leading-relaxed"
            >
              Deep-layer analysis of your technical DNA. We compare your projects, skills, and coding patterns against live market benchmarks.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-background/40 backdrop-blur-xl p-3 rounded-[2.5rem] border border-border/40 shadow-xl"
          >
            <div className="relative flex-1 sm:w-64">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full h-14 pl-11 pr-6 rounded-[1.75rem] border-2 border-border/40 bg-muted/40 font-black text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer transition-all"
                >
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                </div>
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="rounded-[1.75rem] h-14 px-8 font-black gap-3 bg-purple-600 hover:bg-purple-700 shadow-2xl shadow-purple-500/30 transition-all active:scale-95 group overflow-hidden relative"
            >
              {isAnalyzing ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Data...</span>
                </>
              ) : (
                <>
                    <Zap className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
                    <span>Generate Insights</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-bold flex items-center gap-3"
            >
                <AlertCircle className="w-5 h-5" />
                {error}
            </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
            {/* Primary Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-8 space-y-8"
            >
                <Card className="overflow-hidden border-none bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 text-white shadow-3xl shadow-purple-500/20 rounded-[3rem] sm:rounded-[4rem] relative group min-h-[400px] sm:min-h-[450px] flex flex-col justify-end">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                        <TrendingUp size={400} />
                    </div>
                    <div className="absolute top-10 left-10 p-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 hidden sm:block">
                        <Award size={48} className="text-purple-200" />
                    </div>

                    <CardHeader className="p-8 sm:p-16 pb-0 relative z-10">
                        <div className="space-y-4">
                            <CardTitle className="text-purple-100/60 text-xs sm:text-sm font-black uppercase tracking-[0.4em]">Overall Market Fit Coefficient</CardTitle>
                            <div className="text-8xl sm:text-[10rem] font-black leading-none flex items-baseline gap-4 tracking-tighter">
                                {initialScores?.overallScore || 0}
                                <span className="text-2xl sm:text-4xl text-purple-300/40">%</span>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-8 sm:p-16 pt-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <p className="text-purple-100 text-lg sm:text-2xl leading-relaxed font-bold max-w-xl">
                                Your current technical profile matches <span className="text-white underline underline-offset-8 decoration-purple-400/50">{initialScores?.overallScore || 0}%</span> of the requirements for <span className="text-white italic">{selectedRole}</span> roles globally.
                            </p>
                            <div className="flex flex-col gap-3 shrink-0">
                                <Badge className="bg-white/10 hover:bg-white/20 text-white border-none py-2 px-6 rounded-xl text-sm font-black backdrop-blur-md">
                                    {getScoreLabel(initialScores?.overallScore)}
                                </Badge>
                                {initialScores?.overallScore && initialScores.overallScore >= 60 && (
                                    <Badge className="bg-emerald-400/20 text-emerald-100 border-none py-2 px-6 rounded-xl text-sm font-black backdrop-blur-md">
                                        Qualified for Hire
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Growth Analysis / Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Proficiency', score: initialScores?.proficiencyScore, icon: Brain },
                        { label: 'DSA Logic', score: initialScores?.problemSolvingScore, icon: LayoutGrid },
                        { label: 'Project Depth', score: initialScores?.projectQualityScore, icon: Star },
                        { label: 'Consistency', score: initialScores?.consistencyScore, icon: Clock }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (i + 1) }}
                        >
                            <Card className="border-2 border-border/30 bg-background/50 backdrop-blur-xl rounded-[2rem] hover:border-purple-500/20 transition-all group overflow-hidden">
                                <CardHeader className="p-6 pb-2">
                                    <CardTitle className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <item.icon className="w-3.5 h-3.5 text-purple-500" /> {item.label}
                                    </CardTitle>
                                    <div className="text-3xl font-black mt-2 group-hover:text-purple-600 transition-colors">{item.score || 0}%</div>
                                </CardHeader>
                                <CardContent className="p-6 pt-2">
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.score || 0}%` }}
                                            className={cn("h-full rounded-full transition-all duration-1000", getScoreColor(item.score))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Sidebar Insights */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-4 space-y-8"
            >
                {/* Gap Analysis Feed */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                        <AlertCircle className="w-6 h-6 text-purple-600" /> Path Strategy
                    </h2>
                    <div className="space-y-4">
                        {insights?.gapAnalysis && insights.gapAnalysis.length > 0 ? (
                            insights.gapAnalysis.map((gap: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 4 }}
                                    className="p-6 rounded-3xl bg-muted/30 border-2 border-border/10 hover:border-purple-500/20 transition-all shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-black text-lg text-foreground tracking-tight">
                                            {gap.skill}
                                        </h3>
                                        <Badge className="bg-purple-500/10 text-purple-600 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">Critical</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-4">
                                        {gap.gap}
                                    </p>
                                    <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 flex items-start gap-3">
                                        <div className="p-1.5 bg-purple-500/20 rounded-lg shrink-0 mt-0.5">
                                            <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                                        </div>
                                        <p className="text-xs text-purple-700 font-bold leading-snug">
                                            {gap.recommendation}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <Card className="p-10 text-center border-dashed border-2 rounded-[2.5rem] bg-muted/10">
                                <div className="w-16 h-16 bg-muted/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Loader2 className="w-8 h-8 text-muted-foreground/20" />
                                </div>
                                <p className="text-muted-foreground font-black text-sm uppercase tracking-widest leading-relaxed">
                                    No Diagnostic Data Available
                                </p>
                                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="mt-8 rounded-2xl h-12 px-6 font-black bg-purple-600/10 text-purple-600 hover:bg-purple-600 hover:text-white border-none transition-all">
                                    Run Engine
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Suggested Roles Card */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                        <TrendingUp className="w-6 h-6 text-purple-600" /> Pivot Vectors
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {insights?.suggestedRoles ? (
                            insights.suggestedRoles.map((role: string, idx: number) => (
                                <Badge 
                                    key={idx} 
                                    className="bg-background border-2 border-border/40 text-foreground py-3 px-5 rounded-2xl text-xs font-black shadow-sm flex items-center gap-2 hover:border-purple-500/50 transition-all cursor-default"
                                >
                                    {role}
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                </Badge>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm font-medium italic">Pending diagnostics...</p>
                        )}
                    </div>
                </div>

                {/* Call to Action - Practice */}
                <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                        <Zap size={150} fill="white" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-2xl font-black tracking-tight">Boost DSA Logic</h3>
                        <p className="text-indigo-100 font-medium leading-relaxed">
                            Simulated environments increase problem-solving speed by 40% on average.
                        </p>
                        <Button 
                            className="w-full rounded-2xl h-14 bg-white text-indigo-600 hover:bg-indigo-50 font-black px-8 mt-4 shadow-xl"
                            onClick={() => router.push('/dashboard/student/interviews')}
                        >
                            Enter Practice Lab
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Skill Inventory */}
                <div className="p-8 rounded-[2.5rem] bg-background border-2 border-border/30">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 mb-6">Current Skill Inventory</h4>
                    <div className="flex flex-wrap gap-2">
                        {userSkills.length > 0 ? (
                            userSkills.map((skill, idx) => (
                                <Badge key={idx} className="bg-muted/50 text-muted-foreground border-border/40 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    {skill.name}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-xs text-muted-foreground font-medium italic">No skills cataloged yet.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
  )
}
