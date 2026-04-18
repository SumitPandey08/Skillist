'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  ShieldCheck,
  Star,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getCareerQuestions, recommendCareer } from '@/app/(dashboard)/dashboard/student/career/_actions'

interface Question {
  id: string
  text: string
  options: string[]
}

interface CareerEngineProps {
  studentData: any
  initialRecommendation: any
  recentAssessments: any[]
}

export function CareerEngine({ studentData, initialRecommendation, recentAssessments }: CareerEngineProps) {
  const [recommendation, setRecommendation] = useState(initialRecommendation)
  const [state, setState] = useState<'idle' | 'loading' | 'questionnaire' | 'results'>('idle')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStartQuestionnaire = async () => {
    setState('loading')
    try {
      const data = await getCareerQuestions()
      setQuestions(data.questions)
      setAnswers(new Array(data.questions.length).fill(''))
      setCurrentQuestionIndex(0)
      setState('questionnaire')
    } catch (error) {
      console.error('Failed to get questions:', error)
      setState('idle')
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleGenerateRecommendation()
    }
  }

  const handleGenerateRecommendation = async () => {
    setIsProcessing(true)
    setState('loading')
    
    const behavioralAnswers = questions.map((q, idx) => ({
      question: q.text,
      answer: answers[idx]
    }))

    const assessmentSummary = recentAssessments.length > 0 
        ? recentAssessments.map(a => `${a.skillName}: ${a.score}%`).join(', ')
        : "No recent assessments taken."

    try {
      const result = await recommendCareer({
        behavioralAnswers,
        assessmentSummary: {
          summary: assessmentSummary,
          id: recentAssessments[0]?.id
        }
      })
      setRecommendation(result)
      setState('results')
    } catch (error) {
      console.error('Failed to get recommendation:', error)
      setState('idle')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-primary bg-clip-text text-transparent uppercase">
            AI Career Engine
          </h1>
          <p className="text-muted-foreground font-medium">
            Discover your ideal IT career path powered by AI and technical data.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-indigo-50 text-indigo-600 border-indigo-100">
                <Sparkles className="w-3 h-3 mr-1" />
                Next-Gen
            </Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {(state === 'idle' && !recommendation) && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black leading-tight uppercase">Your future, <br />calculated.</h2>
                    <p className="text-lg text-muted-foreground">
                        Our engine analyzes your technical skill test results and behavioral preferences to find your perfect fit in the tech ecosystem.
                    </p>
                </div>
                
                <div className="space-y-4">
                    {[
                        { icon: ShieldCheck, text: "Skill-based precision targeting" },
                        { icon: Target, text: "Behavioral archetype matching" },
                        { icon: TrendingUp, text: "Market-aligned role suggestions" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wide">{item.text}</span>
                        </div>
                    ))}
                </div>

                <Button 
                    size="lg" 
                    className="h-14 px-8 font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/25"
                    onClick={handleStartQuestionnaire}
                >
                    Start Career Analysis <Zap className="w-5 h-5 fill-current" />
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full" />
                <Card className="border-4 border-primary/5 shadow-2xl relative overflow-hidden bg-background/50 backdrop-blur-sm">
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                                <Compass className="w-8 h-8 text-indigo-600 animate-pulse" />
                            </div>
                            <div>
                                <p className="font-black text-xl tracking-tight">ENGINE STATUS</p>
                                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 uppercase">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    Online & Ready
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 opacity-50">
                            <div className="h-4 bg-muted rounded-full w-full" />
                            <div className="h-4 bg-muted rounded-full w-3/4" />
                            <div className="h-4 bg-muted rounded-full w-5/6" />
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Required Data</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={cn(
                                    "p-3 rounded-xl border-2 flex items-center gap-2",
                                    recentAssessments.length > 0 ? "border-emerald-500/20 bg-emerald-50/10" : "border-muted"
                                )}>
                                    <CheckCircle2 className={cn("w-4 h-4", recentAssessments.length > 0 ? "text-emerald-500" : "text-muted-foreground")} />
                                    <span className="text-[10px] font-black uppercase">Skill Data</span>
                                </div>
                                <div className="p-3 rounded-xl border-2 border-muted flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-[10px] font-black uppercase">User Input</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
          </motion.div>
        )}

        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center space-y-6"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">Processing Parameters...</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Our career strategists (AI) are analyzing your unique profile to build a custom roadmap.
                </p>
            </div>
          </motion.div>
        )}

        {state === 'questionnaire' && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
             <div className="flex items-center justify-between mb-8">
              <div>
                <Badge className="bg-indigo-100 text-indigo-600 border-none px-3 py-1 font-black uppercase text-[10px]">Step {currentQuestionIndex + 1} of {questions.length}</Badge>
                <h2 className="text-2xl font-black uppercase tracking-tight mt-1">Behavioral Analysis</h2>
              </div>
              <div className="flex gap-1">
                {questions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-all duration-300",
                      idx === currentQuestionIndex ? "bg-indigo-600 w-12" : 
                      idx < currentQuestionIndex ? "bg-indigo-600/30" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            <Card className="border-4 border-indigo-500/10 shadow-2xl overflow-hidden">
                <CardHeader className="p-8 bg-indigo-50/30">
                    <CardTitle className="text-xl md:text-2xl font-black leading-tight">
                        {questions[currentQuestionIndex].text}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <RadioGroup 
                        value={answers[currentQuestionIndex]} 
                        onValueChange={(val) => {
                            const newAnswers = [...answers]
                            newAnswers[currentQuestionIndex] = val
                            setAnswers(newAnswers)
                        }}
                        className="grid md:grid-cols-2 gap-4"
                    >
                        {questions[currentQuestionIndex].options.map((option, idx) => (
                            <div 
                                key={idx}
                                className={cn(
                                    "flex items-center space-x-3 p-5 rounded-2xl border-2 transition-all cursor-pointer group",
                                    answers[currentQuestionIndex] === option 
                                        ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-600/5" 
                                        : "border-border hover:border-indigo-600/20 hover:bg-muted/50"
                                )}
                                onClick={() => {
                                    const newAnswers = [...answers]
                                    newAnswers[currentQuestionIndex] = option
                                    setAnswers(newAnswers)
                                }}
                            >
                                <RadioGroupItem value={option} id={`opt-${idx}`} className="hidden" />
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                                    answers[currentQuestionIndex] === option ? "border-indigo-600 bg-indigo-600" : "border-muted-foreground/30 group-hover:border-indigo-600/50"
                                )}>
                                    {answers[currentQuestionIndex] === option && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <Label className="text-sm font-bold cursor-pointer flex-1 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
                <CardFooter className="p-8 bg-muted/10 border-t flex justify-between gap-4">
                    <Button 
                        variant="outline" 
                        className="font-black uppercase text-xs tracking-widest px-6"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    >
                        Previous
                    </Button>
                    <Button 
                        className="px-10 h-12 gap-2 font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700"
                        disabled={!answers[currentQuestionIndex]}
                        onClick={handleNext}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Analyze My Future' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>
          </motion.div>
        )}

        {(state === 'results' || (state === 'idle' && recommendation)) && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-12"
          >
            {/* Recommendation Hero Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Role Suggestions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-amber-500 fill-current" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Recommended Career Paths</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {JSON.parse(recommendation.suggestedRoles).map((role: string, idx: number) => (
                            <Card key={idx} className={cn(
                                "border-2 overflow-hidden group hover:shadow-xl transition-all",
                                idx === 0 ? "border-indigo-600 bg-indigo-50/10" : "border-border"
                            )}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center",
                                            idx === 0 ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground"
                                        )}>
                                            <Target className="w-5 h-5" />
                                        </div>
                                        {idx === 0 && <Badge className="bg-indigo-600 font-black uppercase text-[8px]">Best Match</Badge>}
                                    </div>
                                    <h3 className="text-lg font-black uppercase leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{role}</h3>
                                    <p className="text-xs text-muted-foreground font-medium mb-4">High demand in technology hubs with 25% growth year-over-year.</p>
                                    <Button variant="ghost" className="p-0 h-auto font-black uppercase text-[10px] tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                                        Explore Role <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Gap Analysis */}
                    <div className="pt-4">
                         <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Technical Gap Analysis</h2>
                        </div>
                        <Card className="border-2 shadow-sm">
                            <CardContent className="p-0">
                                {JSON.parse(recommendation.gapAnalysis).map((gap: any, idx: number) => (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 p-5 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="font-black text-[9px] uppercase border-indigo-200 text-indigo-600">{gap.skill}</Badge>
                                                <span className="text-sm font-bold uppercase tracking-tight">{gap.gap}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium">{gap.recommendation}</p>
                                        </div>
                                        <div className="md:w-32">
                                            <Progress value={Math.random() * 60 + 20} className="h-1.5" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right: Action Plan */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Your Action Plan</h2>
                    </div>
                    <Card className="border-4 border-indigo-600 bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap className="w-32 h-32 rotate-12 fill-current" />
                        </div>
                        <CardHeader className="p-6 pb-0">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Next 30-60-90 Days</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {JSON.parse(recommendation.actionPlan).map((step: any, idx: number) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="h-7 w-7 rounded-full bg-white text-indigo-600 flex items-center justify-center font-black text-xs shrink-0 shadow-lg">
                                            {idx + 1}
                                        </div>
                                        {idx < 4 && <div className="w-0.5 h-full bg-white/20 mt-1" />}
                                    </div>
                                    <div className="pb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-black text-sm uppercase tracking-tight leading-none">{step.step}</span>
                                            <Badge className={cn(
                                                "text-[8px] font-black uppercase border-none h-4",
                                                step.priority === 'High' ? "bg-amber-400 text-amber-950" : "bg-indigo-400 text-white"
                                            )}>{step.priority}</Badge>
                                        </div>
                                        <p className="text-[10px] text-indigo-100 font-medium leading-relaxed opacity-80">{step.resource}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase tracking-widest text-xs h-12 shadow-xl">
                                Download Blueprint PDF
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-2 p-6 bg-muted/50 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border shadow-sm">
                                <GraduationCap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-black text-xs uppercase tracking-tight">Need specific skills?</p>
                                <p className="text-[10px] text-muted-foreground font-medium">Auto-generate a Roadmap based on this result.</p>
                            </div>
                         </div>
                         <Button variant="outline" className="w-full font-bold text-xs uppercase h-10 border-2" onClick={() => setState('idle')}>
                            Start New Analysis
                         </Button>
                    </Card>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
