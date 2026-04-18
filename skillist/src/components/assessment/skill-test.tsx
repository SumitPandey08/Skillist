'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Brain, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Trophy, 
  Target, 
  BookOpen,
  Timer,
  ChevronRight,
  RefreshCw,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { generateAssessment, submitAssessment } from '@/app/(dashboard)/dashboard/student/assessment/_actions'

interface Question {
  id: string
  question: string
  options: string[]
  correctOptionIndex: number
  explanation: string
}

interface SkillTestProps {
  studentData: any
  initialAssessments: any[]
}

export function SkillTest({ studentData, initialAssessments }: SkillTestProps) {
  const [assessments, setAssessments] = useState(initialAssessments)
  const [state, setState] = useState<'idle' | 'generating' | 'testing' | 'results'>('idle')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsGenerating] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const studentSkills = studentData?.skills?.map((s: any) => s.skill.name) || []

  const handleStartTest = async (skill: string) => {
    setSelectedSkill(skill)
    setState('generating')
    setIsGenerating(true)
    
    try {
      const data = await generateAssessment(skill)
      setQuestions(data.questions)
      setAnswers(new Array(data.questions.length).fill(-1))
      setCurrentQuestionIndex(0)
      setState('testing')
    } catch (error) {
      console.error('Failed to generate test:', error)
      setState('idle')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setState('generating') // Using generating state for loading
    
    const correctCount = answers.reduce((acc, curr, idx) => {
      return curr === questions[idx].correctOptionIndex ? acc + 1 : acc
    }, 0)
    
    const score = Math.round((correctCount / questions.length) * 100)
    
    const resultData = {
      skillName: selectedSkill,
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      identifiedGaps: questions
        .filter((_, idx) => answers[idx] !== questions[idx].correctOptionIndex)
        .map(q => q.question.split(' ').slice(0, 3).join(' ') + '...') // Simplified gaps
    }

    try {
      const saved = await submitAssessment(resultData)
      setTestResult(saved)
      setAssessments([saved, ...assessments])
      setState('results')
    } catch (error) {
      console.error('Failed to submit test:', error)
      setState('idle')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent uppercase">
            AI Skill Assessment
          </h1>
          <p className="text-muted-foreground font-medium">
            Test your knowledge and get real-time feedback on your technical skills.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
                <Brain className="w-3 h-3 mr-1" />
                AI Powered
            </Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-primary/20 transition-all">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 font-bold">
                    <Zap className="w-5 h-5 text-amber-500" />
                    New Assessment
                  </CardTitle>
                  <CardDescription>Select a skill to generate a custom 10-question test.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {studentSkills.map((skill: string) => (
                      <Button
                        key={skill}
                        variant="outline"
                        className={cn(
                          "rounded-full px-4 h-9 font-semibold",
                          selectedSkill === skill && "bg-primary text-white border-primary hover:bg-primary/90"
                        )}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full h-11 gap-2 font-bold shadow-lg shadow-primary/20" 
                    disabled={!selectedSkill || isSubmitting}
                    onClick={() => handleStartTest(selectedSkill)}
                  >
                    Generate Test <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-muted/30 border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 font-bold">
                    <Timer className="w-5 h-5 text-indigo-500" />
                    Recent Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assessments.length > 0 ? (
                    <div className="space-y-3">
                      {assessments.slice(0, 4).map((a, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-background border">
                          <div>
                            <p className="font-bold text-sm uppercase">{a.skillName}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(a.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={cn(
                              "font-black text-xs",
                              a.score >= 80 ? "bg-emerald-500" : a.score >= 50 ? "bg-amber-500" : "bg-red-500"
                          )}>
                            {a.score}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                      <BookOpen className="w-8 h-8 mb-2" />
                      <p className="text-sm font-medium">No tests taken yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <p className="font-bold text-indigo-900">Why take assessments?</p>
                    <p className="text-sm text-indigo-800/80">
                        Our Career Recommendation Engine uses your test scores to suggest the best-fitting job roles and learning paths.
                    </p>
                </div>
            </div>
          </motion.div>
        )}

        {state === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">AI is Thinking...</h3>
                <p className="text-muted-foreground max-w-sm">
                    {isSubmitting 
                        ? `Generating high-quality technical questions for ${selectedSkill}.` 
                        : "Evaluating your answers and identifying skill gaps."
                    }
                </p>
            </div>
          </motion.div>
        )}

        {state === 'testing' && questions.length > 0 && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="px-3 py-1 font-black uppercase">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <div className="flex gap-2">
                {questions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-1.5 w-6 rounded-full transition-all duration-300",
                      idx === currentQuestionIndex ? "bg-primary w-10" : 
                      idx < currentQuestionIndex ? "bg-primary/40" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            <Card className="border-4 border-primary/10 shadow-xl overflow-hidden">
                <div className="h-2 bg-muted w-full">
                    <motion.div 
                        className="h-full bg-primary" 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <CardHeader className="pt-8 px-8 pb-4 bg-muted/20">
                    <CardTitle className="text-xl md:text-2xl font-black leading-tight">
                        {questions[currentQuestionIndex].question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <RadioGroup 
                        value={answers[currentQuestionIndex].toString()} 
                        onValueChange={(val) => {
                            const newAnswers = [...answers]
                            newAnswers[currentQuestionIndex] = parseInt(val)
                            setAnswers(newAnswers)
                        }}
                        className="space-y-4"
                    >
                        {questions[currentQuestionIndex].options.map((option, idx) => (
                            <div 
                                key={idx}
                                className={cn(
                                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                                    answers[currentQuestionIndex] === idx 
                                        ? "border-primary bg-primary/5 shadow-md" 
                                        : "border-border hover:border-primary/20 hover:bg-muted/50"
                                )}
                                onClick={() => {
                                    const newAnswers = [...answers]
                                    newAnswers[currentQuestionIndex] = idx
                                    setAnswers(newAnswers)
                                }}
                            >
                                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} className="hidden" />
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                                    answers[currentQuestionIndex] === idx ? "border-primary bg-primary" : "border-muted-foreground/30"
                                )}>
                                    {answers[currentQuestionIndex] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <Label className="text-base font-bold cursor-pointer flex-1 leading-relaxed">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
                <CardFooter className="p-8 bg-muted/10 border-t flex justify-between gap-4">
                    <Button 
                        variant="ghost" 
                        className="font-bold uppercase tracking-wider"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    >
                        Previous
                    </Button>
                    <Button 
                        className="px-10 h-12 gap-2 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                        disabled={answers[currentQuestionIndex] === -1}
                        onClick={handleNext}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>
          </motion.div>
        )}

        {state === 'results' && testResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-4 border-primary/10 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                    <div className={cn(
                        "absolute top-0 left-0 w-full h-1.5",
                        testResult.score >= 80 ? "bg-emerald-500" : testResult.score >= 50 ? "bg-amber-500" : "bg-red-500"
                    )} />
                    <Trophy className={cn(
                        "w-12 h-12 mb-4",
                        testResult.score >= 80 ? "text-emerald-500" : testResult.score >= 50 ? "text-amber-500" : "text-red-500"
                    )} />
                    <h3 className="font-black text-sm uppercase text-muted-foreground mb-1">Your Score</h3>
                    <div className="text-6xl font-black mb-2">{testResult.score}%</div>
                    <p className="text-xs font-bold text-muted-foreground">
                        {testResult.correctAnswers} of {testResult.totalQuestions} Correct
                    </p>
                </Card>

                <Card className="md:col-span-2 border-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-500" />
                            Skill Gap Analysis
                        </CardTitle>
                        <CardDescription>AI identified the following areas for improvement in {selectedSkill}:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            {JSON.parse(testResult.identifiedGaps).map((gap: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-semibold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    {gap}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border-2 p-6 rounded-2xl">
                <div className="space-y-1">
                    <p className="font-black uppercase tracking-tight">Ready for career advice?</p>
                    <p className="text-sm text-muted-foreground">Use this result to get personalized job role recommendations.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold" onClick={() => setState('idle')}>
                        Back to List
                    </Button>
                    <Button className="font-bold gap-2 shadow-lg shadow-primary/15">
                        Open Career Engine <Zap className="w-4 h-4" />
                    </Button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
