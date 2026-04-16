'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, GraduationCap, MapPin, Loader2, Trash2 } from 'lucide-react'
import { generateAndSaveRoadmap, updateRoadmapStepStatus, deleteRoadmap } from '@/app/dashboard/student/_actions'
import { cn } from '@/lib/utils'

interface RoadmapStep {
  id: string
  title: string
  description: string | null
  status: string
  order: number
}

interface Roadmap {
  id: string
  targetRole: string
  description: string | null
  progress: number
  steps: RoadmapStep[]
}

export function RoadmapSection({ initialRoadmap }: { initialRoadmap: Roadmap | null }) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(initialRoadmap)
  const [targetRole, setTargetRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRole.trim()) return

    setIsLoading(true)
    try {
      const result = await generateAndSaveRoadmap(targetRole)
      if (result.success) {
        // We'll just refresh or re-fetch for simplicity or set the new one if we had a full get action
        window.location.reload() 
      }
    } catch (error) {
      console.error('Failed to generate roadmap:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStep = async (stepId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    
    // Optimistic Update
    if (roadmap) {
      const newSteps = roadmap.steps.map(s => 
        s.id === stepId ? { ...s, status: newStatus } : s
      )
      const completedCount = newSteps.filter(s => s.status === 'completed').length
      const newProgress = Math.round((completedCount / newSteps.length) * 100)
      
      setRoadmap({ ...roadmap, steps: newSteps, progress: newProgress })
    }

    try {
      await updateRoadmapStepStatus(stepId, newStatus as any)
    } catch (error) {
      console.error('Failed to update step status:', error)
      // Rollback on failure if needed
    }
  }

  const handleDelete = async () => {
    if (!roadmap) return
    setIsDeleting(true)
    try {
      await deleteRoadmap(roadmap.id)
      setRoadmap(null)
    } catch (error) {
      console.error('Failed to delete roadmap:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!roadmap) {
    return (
      <div className="glass p-8 rounded-3xl border border-white/5 mt-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap size={120} />
        </div>
        
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="text-primary" />
            Your Career Roadmap
          </h2>
          <p className="text-muted-foreground mb-6">
            Enter your dream job, and our AI will build a personalized learning path tailored to your current skills.
          </p>

          <form onSubmit={handleGenerate} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !targetRole.trim()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Build My Path'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="glass p-8 rounded-3xl border border-white/5 mt-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <MapPin className="text-primary" />
            Roadmap to {roadmap.targetRole}
          </h2>
          <p className="text-muted-foreground">{roadmap.description}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-muted-foreground hover:text-destructive transition-colors p-2"
          title="Delete Roadmap"
        >
          {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-bold text-primary">{roadmap.progress}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${roadmap.progress}%` }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          />
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="absolute left-6 top-8 bottom-8 w-px bg-white/10 pointer-events-none" />
        
        {roadmap.steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
              step.status === 'completed' 
                ? "bg-primary/5 border-primary/20" 
                : "bg-white/5 border-white/5 hover:border-white/20"
            )}
            onClick={() => handleToggleStep(step.id, step.status)}
          >
            <div className="relative z-10 pt-1">
              {step.status === 'completed' ? (
                <CheckCircle2 className="text-primary" size={24} />
              ) : (
                <Circle className="text-muted-foreground group-hover:text-primary transition-colors" size={24} />
              )}
            </div>
            <div>
              <h3 className={cn(
                "font-bold mb-1 transition-all",
                step.status === 'completed' ? "text-primary/80 line-through" : "text-foreground"
              )}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
