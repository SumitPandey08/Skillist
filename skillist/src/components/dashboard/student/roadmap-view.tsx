'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { 
  CheckCircle2, Circle, GraduationCap, MapPin, 
  Loader2, Trash2, Video, ExternalLink, 
  ChevronRight, Sparkles, BookOpen, Target, Plus,
  Clock, Trophy, Lightbulb, Zap, ArrowRight,
  Search, Filter, Share2, Download
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

export function RoadmapView({ initialRoadmaps }: { initialRoadmaps: Roadmap[] }) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps)
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(roadmaps[0] || null)
  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [targetRole, setTargetRole] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
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

    // Optimistic Update
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 text-center bg-background/50 backdrop-blur-3xl border border-border/40 rounded-[4rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-50" />
        <div className="relative z-10">
          <div className="w-32 h-32 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto animate-bounce-slow">
            <Target className="w-16 h-16 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Forge Your Destiny</h2>
          <p className="text-muted-foreground mb-10 max-w-md text-lg mx-auto leading-relaxed">
            Tell our AI your dream role, and we'll engineer a personalized, high-performance learning path just for you.
          </p>
          <form onSubmit={handleGenerate} className="w-full max-w-lg flex flex-col gap-4 mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="e.g. Full Stack Architect @ Google"
                className="w-full bg-muted/40 border-2 border-border/40 rounded-3xl px-8 py-6 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all text-center text-xl font-bold placeholder:text-muted-foreground/30 group-hover:bg-muted/60"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500/30 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <Button 
              type="submit" 
              disabled={!targetRole.trim() || isGenerating}
              className="rounded-3xl h-20 font-black text-xl bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin mr-3" /> : <Zap className="mr-3" />}
              {isGenerating ? "Synthesizing Path..." : "Generate Master Roadmap"}
            </Button>
          </form>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-10 pb-32">
      {/* Dynamic Header Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 z-40 bg-background/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-border/40 shadow-xl shadow-black/5">
        <div className="flex gap-3 overflow-x-auto pb-1 max-w-full scrollbar-hide px-2">
          {roadmaps.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRoadmap(r)}
              className={cn(
                "whitespace-nowrap px-6 py-3 rounded-2xl font-black text-sm transition-all duration-500 flex items-center gap-3 border-2",
                activeRoadmap?.id === r.id 
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105" 
                  : "bg-muted/50 border-transparent hover:border-border/60 hover:bg-muted"
              )}
            >
              {r.targetRole}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[10px]",
                activeRoadmap?.id === r.id ? "bg-white/20" : "bg-emerald-500/10 text-emerald-600"
              )}>
                {r.progress}%
              </div>
            </button>
          ))}
          <Button 
            onClick={() => setRoadmaps([])}
            variant="ghost"
            className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 p-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search steps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border/40 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <Button variant="outline" className="rounded-2xl h-11 px-4 border-border/60">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {activeRoadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Roadmap Tree - Superior to roadmap.sh */}
          <div className="lg:col-span-8 relative px-4" ref={containerRef}>
            {/* The Dynamic Path - Organic Curve */}
            <div className="absolute left-[3.25rem] top-12 bottom-12 w-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div 
                style={{ scaleY }}
                className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-emerald-400 to-blue-500 origin-top"
              />
            </div>
            
            <div className="flex flex-col gap-16 relative">
              <AnimatePresence mode="popLayout">
                {filteredSteps.map((step, idx) => {
                  const isCompleted = step.status === 'completed'
                  const isInProgress = step.status === 'in_progress'
                  
                  return (
                    <motion.div 
                      key={step.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="relative flex items-start gap-10 group"
                    >
                      {/* Interactive Node Connector */}
                      <div className="relative z-10 pt-4">
                            <motion.button
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const nextStatus = step.status === 'completed' ? 'pending' : step.status === 'in_progress' ? 'completed' : 'in_progress'
                                handleStatusUpdate(step.id, nextStatus as any)
                              }}
                              className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-4 shadow-2xl relative overflow-hidden",
                                isCompleted
                                  ? "bg-emerald-500 border-emerald-200 text-white shadow-emerald-500/40"
                                  : isInProgress
                                  ? "bg-amber-500 border-amber-200 text-white shadow-amber-500/40 animate-pulse"
                                  : "bg-background border-border/60 text-muted-foreground group-hover:border-emerald-500/40 group-hover:text-emerald-500"
                              )}
                            >
                              {isCompleted ? <CheckCircle2 size={28} /> : isInProgress ? <Clock size={28} /> : <span className="text-xl font-black">{idx + 1}</span>}
                              
                              {/* Glowing Aura for active step */}
                              {isInProgress && (
                                <div className="absolute inset-0 bg-white/20 animate-ping opacity-50" />
                              )}
                            </motion.button>
                      </div>

                      {/* Step Glass Card */}
                      <motion.div
                        onClick={() => setSelectedStep(step)}
                        className={cn(
                          "flex-1 p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group/card",
                          isCompleted
                            ? "bg-emerald-500/5 border-emerald-500/20 grayscale-[0.3] hover:grayscale-0"
                            : isInProgress
                            ? "bg-amber-500/5 border-amber-500/30 shadow-2xl shadow-amber-500/10 scale-[1.02]"
                            : "bg-background/40 backdrop-blur-md border-border/40 hover:border-emerald-500/40 hover:bg-background/80 shadow-xl"
                        )}
                      >
                        {/* Background Decorative Element */}
                        <div className={cn(
                            "absolute -right-4 -bottom-4 w-32 h-32 blur-3xl opacity-10 transition-all duration-700 group-hover/card:scale-150",
                            isCompleted ? "bg-emerald-500" : isInProgress ? "bg-amber-500" : "bg-blue-500"
                        )} />

                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="secondary" className={cn(
                                        "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                                        isCompleted ? "bg-emerald-100 text-emerald-700" : isInProgress ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                                    )}>
                                        {step.status.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {step.estimatedHours || 4}h
                                    </span>
                                </div>
                                <h3 className={cn(
                                    "text-2xl font-black tracking-tight transition-all duration-500",
                                    isCompleted && "text-muted-foreground line-through opacity-60"
                                )}>
                                    {step.title}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {step.difficulty && (
                                    <Badge className="bg-blue-500/10 text-blue-600 border-none text-[10px] uppercase font-black">
                                        {step.difficulty}
                                    </Badge>
                                )}
                                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/10 text-[10px] uppercase font-black">
                                    Curated AI
                                </Badge>
                            </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed text-lg mb-6 line-clamp-2 font-medium">
                            {step.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/20">
                            <div className="flex items-center gap-2 text-sm font-black text-emerald-600/70 group-hover/card:text-emerald-600 transition-colors">
                                <Video className="w-4 h-4" />
                                <span>{step.resources?.videos.length || 0} Lectures</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-black text-blue-600/70 group-hover/card:text-blue-600 transition-colors">
                                <BookOpen className="w-4 h-4" />
                                <span>{step.resources?.links.length || 0} Articles</span>
                            </div>
                            <div className="ml-auto p-2 bg-muted/40 rounded-full group-hover/card:bg-emerald-500 group-hover/card:text-white transition-all duration-500">
                                <ArrowRight className="w-5 h-5 translate-x-0 group-hover/card:translate-x-0.5" />
                            </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel - Stats & Gamification */}
          <div className="lg:col-span-4 space-y-8">
            {/* Progress Card */}
            <div className="p-8 rounded-[3rem] bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <Trophy className="w-10 h-10 text-emerald-200" />
                        <div className="text-right">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-100/60">Level</span>
                            <div className="text-2xl font-black">Senior {activeRoadmap.progress > 50 ? 'II' : 'I'}</div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between items-end">
                            <span className="text-5xl font-black">{activeRoadmap.progress}%</span>
                            <span className="text-emerald-200 font-bold mb-1">Mastery</span>
                        </div>
                        <div className="h-4 bg-black/20 rounded-full overflow-hidden p-1 border border-white/10">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${activeRoadmap.progress}%` }}
                                className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2rem] border border-white/5">
                            <div className="text-[10px] font-black uppercase text-emerald-100/60 mb-2">Acquired</div>
                            <div className="text-2xl font-black">{activeRoadmap.steps.filter(s => s.status === 'completed').length}</div>
                            <div className="text-[10px] font-bold text-emerald-100/40">Skills</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2rem] border border-white/5">
                            <div className="text-[10px] font-black uppercase text-emerald-100/60 mb-2">Focusing</div>
                            <div className="text-2xl font-black">{activeRoadmap.steps.filter(s => s.status === 'in_progress').length}</div>
                            <div className="text-[10px] font-bold text-emerald-100/40">Learning</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Up / Recommendations */}
            <div className="p-8 rounded-[3rem] bg-background border-2 border-border/40 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h4 className="font-black text-lg tracking-tight">AI Insights</h4>
                </div>
                
                <div className="space-y-4">
                    {activeRoadmap.steps.find(s => s.status === 'in_progress') ? (
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                            <p className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-widest">Priority Target</p>
                            <p className="text-sm font-bold leading-tight">Focus on mastering {activeRoadmap.steps.find(s => s.status === 'in_progress')?.title}</p>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-widest">Next Milestone</p>
                            <p className="text-sm font-bold leading-tight">Ready to begin: {activeRoadmap.steps.find(s => s.status === 'pending')?.title}</p>
                        </div>
                    )}
                    
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                        <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-widest">Market Trend</p>
                        <p className="text-sm font-bold leading-tight">This role is seeing a 24% increase in hiring demand this quarter.</p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border/40 flex flex-col gap-3">
                    <Button variant="outline" className="w-full h-12 rounded-2xl font-black border-border/60 gap-2">
                        <Share2 className="w-4 h-4" /> Export Roadmap
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full h-12 rounded-2xl font-black text-destructive hover:bg-destructive/10 gap-2"
                        onClick={() => handleDelete(activeRoadmap.id)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <><Trash2 size={18} /> Terminate Path</>}
                    </Button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Detail Dialog */}
      <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto rounded-[3.5rem] p-0 border-none bg-background shadow-3xl overflow-x-hidden">
          {selectedStep && (
            <div className="flex flex-col">
              {/* Animated Header */}
              <div className={cn(
                  "h-64 relative overflow-hidden flex items-end p-12 transition-colors duration-1000",
                  selectedStep.status === 'completed' ? "bg-emerald-600" : selectedStep.status === 'in_progress' ? "bg-amber-500" : "bg-blue-600"
              )}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    className="absolute top-0 right-0 p-12 pointer-events-none"
                >
                    <Sparkles size={240} />
                </motion.div>
                
                <div className="relative z-10 flex flex-col gap-4 w-full">
                    <div className="flex gap-2">
                        <Badge className="bg-white/20 text-white border-none text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1.5 backdrop-blur-md">
                            Milestone {selectedStep.order}
                        </Badge>
                        <Badge className="bg-black/20 text-white border-none text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1.5 backdrop-blur-md">
                            {selectedStep.estimatedHours || 4} Hours
                        </Badge>
                    </div>
                    <div className="flex justify-between items-end gap-6">
                        <DialogTitle className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                            {selectedStep.title}
                        </DialogTitle>
                        <div className="flex items-center gap-2 mb-1">
                            {selectedStep.status === 'completed' && <Trophy className="text-white w-8 h-8" />}
                        </div>
                    </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-14">
                <div className="lg:col-span-8 space-y-12">
                    {/* Knowledge Base Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[0.2em] text-sm">
                            <div className="p-2 bg-emerald-500/10 rounded-xl">
                                <BookOpen size={20} />
                            </div>
                            Deep Study Notes
                        </div>
                        <div className="bg-muted/30 p-10 rounded-[2.5rem] border border-border/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                            <div className="prose prose-invert max-w-none relative z-10">
                                <div className="leading-relaxed whitespace-pre-wrap font-medium text-xl text-foreground/80 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-emerald-500">
                                    {selectedStep.notes || selectedStep.description}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Interactive Resources */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.2em] text-sm">
                                <div className="p-2 bg-blue-500/10 rounded-xl">
                                    <Video size={20} />
                                </div>
                                Curated Masterclasses
                            </div>
                            <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                {selectedStep.resources?.videos.length || 0} Assets
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {selectedStep.resources?.videos.map((video, vIdx) => (
                                <motion.a 
                                    whileHover={{ y: -8 }}
                                    key={vIdx}
                                    href={video.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group/video flex flex-col gap-4 p-6 rounded-[2.5rem] bg-background border-2 border-border/40 hover:border-emerald-500/40 hover:bg-muted/10 transition-all shadow-xl hover:shadow-2xl"
                                >
                                    <div className="aspect-video bg-muted rounded-[1.5rem] flex items-center justify-center relative overflow-hidden">
                                        {/* Mock Thumbnail / Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-transparent to-blue-500/30 group-hover/video:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl scale-90 group-hover/video:scale-100 transition-transform duration-500">
                                                <ChevronRight className="w-10 h-10 text-white ml-1 fill-white" />
                                            </div>
                                        </div>
                                        <Badge className="absolute bottom-4 right-4 bg-black/60 text-white border-none">12:45</Badge>
                                    </div>
                                    <div className="px-2">
                                        <h4 className="font-black text-xl mb-2 group-hover/video:text-emerald-600 transition-colors line-clamp-2 leading-tight">{video.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-black tracking-widest uppercase">
                                                Platform: <span className="text-foreground">YouTube</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-border" />
                                            <ExternalLink size={14} className="text-muted-foreground" />
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="p-8 rounded-[2.5rem] bg-muted/20 border-2 border-border/40 space-y-8 sticky top-8">
                        <div className="space-y-4">
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Execution Status</h5>
                            <div className="grid gap-3">
                                <Button 
                                    onClick={() => handleStatusUpdate(selectedStep.id, 'completed')}
                                    className={cn(
                                        "h-16 rounded-2xl font-black text-lg gap-3 shadow-xl transition-all",
                                        selectedStep.status === 'completed' 
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                                            : "bg-background border-2 border-border/40 text-foreground hover:bg-muted"
                                    )}
                                >
                                    <CheckCircle2 size={24} /> {selectedStep.status === 'completed' ? 'Mastered' : 'Mark as Mastered'}
                                </Button>
                                <Button 
                                    onClick={() => handleStatusUpdate(selectedStep.id, 'in_progress')}
                                    className={cn(
                                        "h-16 rounded-2xl font-black text-lg gap-3 shadow-xl transition-all",
                                        selectedStep.status === 'in_progress' 
                                            ? "bg-amber-500 text-white hover:bg-amber-600" 
                                            : "bg-background border-2 border-border/40 text-foreground hover:bg-muted"
                                    )}
                                >
                                    <Clock size={24} /> {selectedStep.status === 'in_progress' ? 'Learning Now' : 'Start Learning'}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Reading Material</h5>
                            <div className="space-y-3">
                                {selectedStep.resources?.links.map((link, lIdx) => (
                                    <a 
                                        key={lIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 rounded-xl bg-background border-2 border-border/20 hover:border-blue-500/40 hover:bg-blue-50/10 transition-all group/link"
                                    >
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                                            <ExternalLink size={16} />
                                        </div>
                                        <span className="text-sm font-bold truncate group-hover/link:text-blue-600">{link.title}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button 
                                variant="outline" 
                                className="w-full h-14 rounded-2xl font-black gap-2 border-border/60"
                                onClick={() => setSelectedStep(null)}
                            >
                                <ArrowRight className="rotate-180 w-4 h-4" /> Return to Path
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
