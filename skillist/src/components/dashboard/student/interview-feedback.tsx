'use client'

import { motion } from 'framer-motion'
import { Award, CheckCircle, TrendingUp, AlertCircle, ArrowRight, User, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface InterviewEvaluation {
  score: number
  feedback: string
  technicalScore: number
  communicationScore: number
  behavioralScore: number
  strengths: string[]
  improvements: string[]
}

export function InterviewFeedback({ evaluation, role }: { evaluation: InterviewEvaluation, role: string }) {
  const stats = [
    { label: 'Technical', score: evaluation.technicalScore, max: 10, color: 'text-blue-400' },
    { label: 'Communication', score: evaluation.communicationScore, max: 10, color: 'text-purple-400' },
    { label: 'Behavioral', score: evaluation.behavioralScore, max: 10, color: 'text-green-400' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Interview Summary</h2>
        <p className="text-muted-foreground">Detailed feedback for the {role} role.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="md:col-span-1 glass p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64" cy="64" r="60"
                className="stroke-white/5 fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="64" cy="64" r="60"
                className="stroke-primary fill-none"
                strokeWidth="8"
                strokeDasharray="377"
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 377 - (377 * evaluation.score) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold">{evaluation.score}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Overall</span>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            {evaluation.score >= 80 ? "Excellent work! You're ready for the real deal." : "Great start. Focus on the areas below to improve."}
          </p>
        </div>

        {/* Stats Card */}
        <div className="md:col-span-2 glass p-8 rounded-3xl border border-white/5 flex flex-col justify-center gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold uppercase tracking-wider opacity-60">{stat.label}</span>
                <span className={cn("text-lg font-bold", stat.color)}>{stat.score}<span className="text-xs text-muted-foreground">/{stat.max}</span></span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.score / stat.max) * 100}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className={cn("h-full shadow-[0_0_10px_rgba(255,255,255,0.1)]", stat.color.replace('text', 'bg'))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/5 space-y-8">
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-primary" />
                Key Insights
            </h3>
            <p className="text-muted-foreground leading-relaxed italic">
                "{evaluation.feedback}"
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
              <CheckCircle size={16} />
              Strengths
            </h4>
            <ul className="space-y-3">
              {evaluation.strengths.map((s, i) => (
                <li key={i} className="text-sm bg-green-400/5 border border-green-400/10 p-3 rounded-xl flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <AlertCircle size={16} />
              Areas to Improve
            </h4>
            <ul className="space-y-3">
              {evaluation.improvements.map((s, i) => (
                <li key={i} className="text-sm bg-amber-400/5 border border-amber-400/10 p-3 rounded-xl flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Link href="/candidate" className="group flex items-center gap-2 bg-white text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all">
          Back to Dashboard
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
