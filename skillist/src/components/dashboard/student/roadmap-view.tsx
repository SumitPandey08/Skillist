'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { 
  CheckCircle2, Circle, GraduationCap, MapPin, 
  Loader2, Trash2, Video, ExternalLink, 
  ChevronRight, Sparkles, BookOpen, Target, Plus,
  Clock, Trophy, Lightbulb, Zap, ArrowRight,
  Search, Filter, Share2, Download, Copy,
  Brain, Rocket, Code2, Globe, Database, Terminal
} from 'lucide-react'
import { generateAndSaveRoadmap, updateRoadmapStepStatus, deleteRoadmap } from '@/app/dashboard/student/_actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface RoadmapStep {
  id: string
  title: string
  description: string | null
  notes: string | null
  resources: {
    videos: { title: string; url: string; thumbnail?: string }[]
    links: { title: string; url: string }[]
  } | null
  status: 'pending' | 'in_progress' | 'completed'
  order: number
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedHours?: number
}

interface Roadmap {
  id: string
  targetRole: string
  description: string | null
  progress: number
  steps: RoadmapStep[]
}

const RECOMMENDATIONS = [
  { role: 'Frontend Architect', icon: Globe, color: 'text-blue-500' },
  { role: 'Backend Engineer', icon: Database, color: 'text-emerald-500' },
  { role: 'AI Specialist', icon: Brain, color: 'text-purple-500' },
  { role: 'DevOps Lead', icon: Terminal, color: 'text-amber-500' }
]

function RoadmapTimeline({ 
  activeRoadmap, 
  filteredSteps, 
  setSelectedStep, 
  handleStatusUpdate 
}: { 
  activeRoadmap: Roadmap,
  filteredSteps: RoadmapStep[],
  setSelectedStep: (step: RoadmapStep) => void,
  handleStatusUpdate: (id: string, status: any) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="lg:col-span-8 relative px-2 sm:px-4" ref={containerRef}>
      {/* The Dynamic Path - Responsive alignment */}
      <div className="absolute left-[1.75rem] sm:left-[3.25rem] top-12 bottom-12 w-1 sm:w-2 bg-muted/20 rounded-full overflow-hidden">
        <motion.div 
          style={{ scaleY }}
          className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-emerald-400 to-blue-500 origin-top shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        />
      </div>
      
      <div className="flex flex-col gap-10 sm:gap-16 relative">
        <AnimatePresence mode="popLayout">
          {filteredSteps.map((step, idx) => {
            const isCompleted = step.status === 'completed'
            const isInProgress = step.status === 'in_progress'
            
            return (
              <motion.div 
                key={step.id} 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="relative flex items-start gap-4 sm:gap-10 group"
              >
                {/* Interactive Node Connector - Responsive Sizing */}
                <div className="relative z-10 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          const nextStatus = step.status === 'completed' ? 'pending' : step.status === 'in_progress' ? 'completed' : 'in_progress'
                          handleStatusUpdate(step.id, nextStatus as any)
                        }}
                        className={cn(
                          "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 border-2 sm:border-4 shadow-xl relative overflow-hidden",
                          isCompleted
                            ? "bg-emerald-500 border-emerald-200 text-white shadow-emerald-500/20"
                            : isInProgress
                            ? "bg-amber-500 border-amber-200 text-white shadow-amber-500/20 animate-pulse"
                            : "bg-background border-border/40 text-muted-foreground group-hover:border-emerald-500/40 group-hover:text-emerald-500"
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" /> : isInProgress ? <Clock className="w-5 h-5 sm:w-7 sm:h-7" /> : <span className="text-sm sm:text-xl font-black">{idx + 1}</span>}
                        
                        {/* Glowing Aura for active step */}
                        {isInProgress && (
                          <div className="absolute inset-0 bg-white/20 animate-ping opacity-40" />
                        )}
                      </motion.button>
                </div>

                {/* Step Glass Card - Refined padding and rounded corners */}
                <motion.div
                  whileHover={{ x: 4, scale: 1.005 }}
                  onClick={() => setSelectedStep(step)}
                  className={cn(
                    "flex-1 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border transition-all duration-500 cursor-pointer relative overflow-hidden group/card",
                    isCompleted
                      ? "bg-emerald-500/[0.02] border-emerald-500/10 grayscale-[0.2] hover:grayscale-0 shadow-sm"
                      : isInProgress
                      ? "bg-amber-500/[0.03] border-amber-500/20 shadow-xl shadow-amber-500/5"
                      : "bg-background/40 backdrop-blur-md border-border/30 hover:border-emerald-500/30 hover:bg-background/60 shadow-lg"
                  )}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                      <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className={cn(
                                  "rounded-md px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest",
                                  isCompleted ? "bg-emerald-100 text-emerald-700" : isInProgress ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                              )}>
                                  {step.status.replace('_', ' ')}
                              </Badge>
                              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground/50 flex items-center gap-1 bg-muted/20 px-2 py-0.5 rounded-md">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {step.estimatedHours || 4}h
                              </span>
                          </div>
                          <h3 className={cn(
                              "text-xl sm:text-2xl font-black tracking-tight transition-all duration-500 leading-snug",
                              isCompleted && "text-muted-foreground line-through opacity-50"
                          )}>
                              {step.title}
                          </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:shrink-0">
                          {step.difficulty && (
                              <Badge className="bg-blue-500/10 text-blue-600 border-none text-[9px] sm:text-[10px] uppercase font-black px-2 py-0.5">
                                  {step.difficulty}
                              </Badge>
                          )}
                          <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/10 text-[9px] sm:text-[10px] uppercase font-black px-2 py-0.5">
                              AI-Validated
                          </Badge>
                      </div>
                  </div>
                  
                  <p className="text-muted-foreground/80 leading-relaxed text-base sm:text-lg mb-6 line-clamp-2 font-medium">
                      {step.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-5 border-t border-border/10">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-600/60 group-hover/card:text-emerald-600 transition-colors">
                          <div className="p-1 rounded-lg bg-emerald-500/5 sm:bg-emerald-500/10">
                            <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span>{step.resources?.videos.length || 0} Lectures</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-blue-600/60 group-hover/card:text-blue-600 transition-colors">
                          <div className="p-1 rounded-lg bg-blue-500/5 sm:bg-blue-500/10">
                            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span>{step.resources?.links.length || 0} Articles</span>
                      </div>
                      <div className="ml-auto p-2 bg-muted/30 rounded-lg sm:rounded-xl group-hover/card:bg-emerald-500 group-hover/card:text-white transition-all duration-500">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/card:translate-x-1" />
                      </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function RoadmapView({ initialRoadmaps }: { initialRoadmaps: Roadmap[] }) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps)
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(roadmaps[0] || null)
  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [targetRole, setTargetRole] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRole.trim()) return

    setIsGenerating(true)
    try {
      const result = await generateAndSaveRoadmap(targetRole)
      if (result.success) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to generate roadmap:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStatusUpdate = async (stepId: string, newStatus: RoadmapStep['status']) => {
    if (!activeRoadmap) return

    const newSteps = activeRoadmap.steps.map(s => 
      s.id === stepId ? { ...s, status: newStatus } : s
    )
    const completedCount = newSteps.filter(s => s.status === 'completed').length
    const newProgress = Math.round((completedCount / newSteps.length) * 100)
    
    const updatedRoadmap = { ...activeRoadmap, steps: newSteps, progress: newProgress }
    setActiveRoadmap(updatedRoadmap)
    setRoadmaps(roadmaps.map(r => r.id === activeRoadmap.id ? updatedRoadmap : r))
    
    if (selectedStep?.id === stepId) {
      setSelectedStep({ ...selectedStep, status: newStatus })
    }

    try {
      await updateRoadmapStepStatus(stepId, newStatus)
    } catch (error) {
      console.error('Failed to update step status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteRoadmap(id)
      const newRoadmaps = roadmaps.filter(r => r.id !== id)
      setRoadmaps(newRoadmaps)
      setActiveRoadmap(newRoadmaps[0] || null)
    } catch (error) {
      console.error('Failed to delete roadmap:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredSteps = activeRoadmap?.steps
    .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.order - b.order) || []

  if (roadmaps.length === 0 && !isGenerating) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 text-center bg-background/50 backdrop-blur-3xl border border-border/30 rounded-[2rem] sm:rounded-[4rem] shadow-2xl relative overflow-hidden min-h-[60vh] sm:min-h-[70vh]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-30" />
        
        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center mx-auto shadow-xl border border-white/5"
          >
            <Rocket className="w-12 h-12 sm:w-20 sm:h-20 text-emerald-500/80" />
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-none">
              Engineer Your Future
            </h2>
            <p className="text-muted-foreground max-w-sm sm:max-w-md text-base sm:text-lg mx-auto leading-relaxed font-medium px-4">
              Our agentic AI will architect a high-performance learning roadmap to master any domain.
            </p>
          </div>
          
          <form onSubmit={handleGenerate} className="flex flex-col gap-4 sm:gap-6 w-full px-2 sm:px-0">
            <div className="relative group">
              <input
                type="text"
                placeholder="Target Role (e.g. AI Specialist)"
                className="w-full bg-muted/20 border-2 border-border/10 rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-5 sm:py-7 focus:ring-4 sm:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all text-center text-lg sm:text-2xl font-black placeholder:text-muted-foreground/20 group-hover:bg-muted/30"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <Sparkles className="hidden sm:block absolute right-8 top-1/2 -translate-y-1/2 text-emerald-500/40" size={24} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {RECOMMENDATIONS.map((rec, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTargetRole(rec.role)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/20 hover:border-emerald-500/30 transition-all text-[10px] sm:text-xs font-bold"
                >
                  <rec.icon className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5", rec.color)} />
                  {rec.role}
                </button>
              ))}
            </div>

            <Button 
              type="submit" 
              disabled={!targetRole.trim() || isGenerating}
              className="rounded-2xl sm:rounded-3xl h-16 sm:h-20 font-black text-lg sm:text-xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/10 transition-all group relative overflow-hidden"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Synthesizing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  <span>Initialize Roadmap</span>
                  <ArrowRight className="hidden sm:block w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8 sm:space-y-12 pb-32">
      {/* Dynamic Header Controls - Compact Mobile UI */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-between sticky top-4 sm:top-6 z-40 bg-background/70 backdrop-blur-2xl p-3 sm:p-5 rounded-2xl sm:rounded-[3rem] border border-border/20 shadow-2xl ring-1 ring-white/5">
        <div className="flex gap-3 overflow-x-auto pb-1 w-full md:w-auto scrollbar-hide px-1">
          {roadmaps.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRoadmap(r)}
              className={cn(
                "whitespace-nowrap px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-[1.5rem] font-black text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 sm:gap-3 border-2",
                activeRoadmap?.id === r.id 
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20" 
                  : "bg-muted/40 border-transparent hover:border-border/40"
              )}
            >
              {r.targetRole}
              <Badge className={cn(
                "h-6 px-1.5 min-w-[2rem] flex items-center justify-center text-[9px] font-black rounded-lg",
                activeRoadmap?.id === r.id ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-600"
              )}>
                {r.progress}%
              </Badge>
            </button>
          ))}
          <Button 
            onClick={() => setRoadmaps([])}
            variant="ghost"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 shrink-0"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input 
              type="text" 
              placeholder="Query path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 border border-border/10 rounded-xl sm:rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <Button variant="outline" className="rounded-xl sm:rounded-2xl h-10 w-10 sm:h-12 sm:w-12 border-border/30 p-0 shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {activeRoadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Main Roadmap Tree */}
          <RoadmapTimeline 
            activeRoadmap={activeRoadmap}
            filteredSteps={filteredSteps}
            setSelectedStep={setSelectedStep}
            handleStatusUpdate={handleStatusUpdate}
          />

          {/* Right Panel - Stats and AI Insights */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 px-2 sm:px-0">
            {/* Progress Card */}
            <div className="p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-emerald-600 text-white shadow-2xl relative overflow-hidden group border border-emerald-400/20">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
                          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-100" />
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-100/60">Stage</span>
                            <div className="text-2xl sm:text-3xl font-black">Level {activeRoadmap.progress > 70 ? 'III' : activeRoadmap.progress > 30 ? 'II' : 'I'}</div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                              <span className="text-5xl sm:text-6xl font-black tracking-tighter leading-none">{activeRoadmap.progress}%</span>
                              <span className="text-emerald-100/50 text-[10px] font-black uppercase tracking-widest mt-2">Overall Proficiency</span>
                            </div>
                        </div>
                        <div className="h-4 bg-black/10 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${activeRoadmap.progress}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5 text-center">
                            <div className="text-[9px] font-black uppercase text-emerald-100/50 mb-1">Mastered</div>
                            <div className="text-2xl font-black">{activeRoadmap.steps.filter(s => s.status === 'completed').length}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5 text-center">
                            <div className="text-[9px] font-black uppercase text-emerald-100/50 mb-1">Studying</div>
                            <div className="text-2xl font-black">{activeRoadmap.steps.filter(s => s.status === 'in_progress').length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights Card */}
            <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-background/40 backdrop-blur-md border border-border/30 shadow-xl relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/10 rounded-xl">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                    </div>
                    <h4 className="font-black text-lg sm:text-xl tracking-tight">AI Strategy</h4>
                </div>
                
                <div className="space-y-4 relative z-10">
                    {activeRoadmap.steps.find(s => s.status === 'in_progress') ? (
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Target className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Focus</span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold leading-snug">
                              Maintain momentum on <span className="text-amber-600">"{activeRoadmap.steps.find(s => s.status === 'in_progress')?.title}"</span>. You're almost there!
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Rocket className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Next</span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold leading-snug">
                              New objective unlocked: <span className="text-emerald-600">"{activeRoadmap.steps.find(s => s.status === 'pending')?.title}"</span>.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-border/10 flex flex-col gap-3">
                    <Button variant="outline" className="w-full h-12 rounded-xl sm:rounded-2xl font-black border-border/30 gap-2 text-xs sm:text-sm">
                        <Share2 className="w-4 h-4" /> Export Roadmaps
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full h-12 rounded-xl sm:rounded-2xl font-black text-destructive/60 hover:text-destructive hover:bg-destructive/5 gap-2 text-xs sm:text-sm"
                        onClick={() => handleDelete(activeRoadmap.id)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <><Trash2 size={16} /> Delete Path</>}
                    </Button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Dialog - Responsive Overhaul */}
      <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1.5rem] sm:rounded-[3rem] p-0 border-none bg-background shadow-2xl overflow-x-hidden scrollbar-hide">
          {selectedStep && (
            <div className="flex flex-col">
              {/* Responsive Header */}
              <div className={cn(
                  "h-48 sm:h-64 relative overflow-hidden flex items-end p-6 sm:p-12 transition-all duration-700",
                  selectedStep.status === 'completed' ? "bg-emerald-600" : selectedStep.status === 'in_progress' ? "bg-amber-500" : "bg-blue-600"
              )}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-[1]" />
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                    <Rocket className="w-32 h-32 sm:w-64 sm:h-64" />
                </div>
                
                <div className="relative z-10 flex flex-col gap-3 w-full">
                    <div className="flex gap-2">
                        <Badge className="bg-white/20 text-white border-none text-[8px] sm:text-[10px] uppercase font-black tracking-widest px-2.5 py-1 backdrop-blur-xl">
                            Phase {selectedStep.order}
                        </Badge>
                        <Badge className="bg-black/20 text-white border-none text-[8px] sm:text-[10px] uppercase font-black tracking-widest px-2.5 py-1 backdrop-blur-xl">
                            ~{selectedStep.estimatedHours || 4}h
                        </Badge>
                    </div>
                    <div className="flex justify-between items-end gap-6">
                        <DialogTitle className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-[1.1] max-w-2xl">
                            {selectedStep.title}
                        </DialogTitle>
                        {selectedStep.status === 'completed' && <Trophy className="text-emerald-100 w-8 h-8 sm:w-12 sm:h-12 drop-shadow-md mb-1" />}
                    </div>
                </div>
              </div>

              {/* Main Content - Improved padding and layout */}
              <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
                <div className="lg:col-span-7 space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[0.1em] text-[10px] sm:text-xs">
                              <div className="p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                  <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              Deep Intelligence Notes
                          </div>
                          <button className="text-[10px] sm:text-xs font-black text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                            <Copy size={12} /> Copy
                          </button>
                        </div>
                        
                        <div className="bg-muted/20 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-border/10 relative overflow-hidden">
                            <div className="prose prose-sm sm:prose-base prose-invert max-w-none relative z-10">
                                <div className="leading-relaxed whitespace-pre-wrap font-medium text-lg sm:text-xl text-foreground/80 first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-emerald-500">
                                    {selectedStep.notes || selectedStep.description}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.1em] text-[10px] sm:text-xs">
                            <div className="p-2 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            Curated Media Path
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            {selectedStep.resources?.videos.map((video, vIdx) => (
                                <motion.a 
                                    whileHover={{ y: -6 }}
                                    key={vIdx}
                                    href={video.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group/video flex flex-col gap-4 p-5 rounded-[2rem] bg-background border border-border/20 hover:border-emerald-500/30 transition-all shadow-md"
                                >
                                    <div className="aspect-video bg-muted rounded-[1.25rem] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent group-hover/video:scale-110 transition-transform duration-700" />
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600/90 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover/video:scale-100 transition-transform">
                                            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1 fill-white" />
                                        </div>
                                    </div>
                                    <div className="px-1">
                                        <h4 className="font-black text-base sm:text-lg mb-2 group-hover/video:text-emerald-600 transition-colors line-clamp-2 leading-tight">{video.title}</h4>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-[9px] font-black tracking-widest uppercase bg-muted px-2 py-1 rounded text-muted-foreground">YouTube</span>
                                            <ExternalLink size={14} className="text-muted-foreground/40" />
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar controls for Dialog */}
                <div className="lg:col-span-5 space-y-10">
                    <div className="p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-muted/10 border border-border/10 space-y-10">
                        <div className="space-y-6">
                            <h5 className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                              <Target size={12} /> Progress Control
                            </h5>
                            <div className="grid gap-3">
                                <Button 
                                    onClick={() => handleStatusUpdate(selectedStep.id, 'completed')}
                                    className={cn(
                                        "h-16 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg gap-3 shadow-xl transition-all",
                                        selectedStep.status === 'completed' 
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                                            : "bg-background border-2 border-border/20 text-foreground hover:bg-muted"
                                    )}
                                >
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> {selectedStep.status === 'completed' ? 'Mastered' : 'Mark Mastered'}
                                </Button>
                                <Button 
                                    onClick={() => handleStatusUpdate(selectedStep.id, 'in_progress')}
                                    className={cn(
                                        "h-16 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg gap-3 shadow-xl transition-all",
                                        selectedStep.status === 'in_progress' 
                                            ? "bg-amber-500 text-white hover:bg-amber-600" 
                                            : "bg-background border-2 border-border/20 text-foreground hover:bg-muted"
                                    )}
                                >
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" /> {selectedStep.status === 'in_progress' ? 'Focusing' : 'Start Focus'}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h5 className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                              <BookOpen size={12} /> Documentation
                            </h5>
                            <div className="space-y-3">
                                {selectedStep.resources?.links.map((link, lIdx) => (
                                    <a 
                                        key={lIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/10 hover:border-blue-500/30 transition-all group/link shadow-sm"
                                    >
                                        <div className="p-2 bg-blue-500/5 rounded-lg text-blue-600 group-hover/link:bg-blue-500 group-hover/link:text-white transition-all">
                                            <ExternalLink size={16} />
                                        </div>
                                        <span className="text-sm font-black truncate group-hover/link:text-blue-600 tracking-tight">{link.title}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/10">
                            <Button 
                                variant="outline" 
                                className="w-full h-14 rounded-xl sm:rounded-2xl font-black gap-2 border-border/30"
                                onClick={() => setSelectedStep(null)}
                            >
                                <ArrowRight className="rotate-180 w-4 h-4" /> Roadmap
                            </Button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>







)
}
