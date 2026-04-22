'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Target, Zap, Code2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SkillData {
  id: string
  name: string
  proficiency: number
  trend: 'up' | 'down' | 'stable'
  category?: string
}

interface SkillIntelligencePanelProps {
  skills: SkillData[]
  targetRoles?: string[]
}

export function SkillIntelligencePanel({ skills, targetRoles = [] }: SkillIntelligencePanelProps) {
  const [skillGaps, setSkillGaps] = useState<string[]>([])
  const [topSkills, setTopSkills] = useState<SkillData[]>([])
  const [weakSkills, setWeakSkills] = useState<SkillData[]>([])
  
  useEffect(() => {
    if (skills.length > 0) {
      // Sort by proficiency
      const sorted = [...skills].sort((a, b) => b.proficiency - a.proficiency)
      setTopSkills(sorted.slice(0, 5))
      setWeakSkills(sorted.filter(s => s.proficiency < 50))
      
      // Determine skill gaps based on target roles
      const gaps: string[] = []
      targetRoles.forEach(role => {
        if (role.toLowerCase().includes('backend')) {
          if (!skills.find(s => s.name.toLowerCase().includes('node') || s.name.toLowerCase().includes('python') || s.name.toLowerCase().includes('java'))) {
            gaps.push('Backend Language (Node/Python/Java)')
          }
          if (!skills.find(s => s.name.toLowerCase().includes('sql') || s.name.toLowerCase().includes('database'))) {
            gaps.push('Database & SQL')
          }
          if (!skills.find(s => s.name.toLowerCase().includes('system design'))) {
            gaps.push('System Design')
          }
        }
        if (role.toLowerCase().includes('frontend')) {
          if (!skills.find(s => s.name.toLowerCase().includes('react') || s.name.toLowerCase().includes('vue') || s.name.toLowerCase().includes('angular'))) {
            gaps.push('Frontend Framework')
          }
        }
      })
      setSkillGaps([...new Set(gaps)])
    }
  }, [skills, targetRoles])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Zap className="w-4 h-4 text-amber-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-amber-500'
    }
  }

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 70) return 'bg-green-500'
    if (proficiency >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 70) return { text: 'Strong', color: 'text-green-500' }
    if (proficiency >= 50) return { text: 'Developing', color: 'text-amber-500' }
    return { text: 'Critical', color: 'text-red-500' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Skill Intelligence
            </CardTitle>
            <Link href="/dashboard/student/portfolio">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skill Gap Alert */}
          {skillGaps.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-500">Skill Gap Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You are missing for your target roles:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skillGaps.map((gap, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                        {gap}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills List */}
          {topSkills.length > 0 ? (
            <div className="space-y-3">
              {topSkills.map((skill, idx) => {
                const proficiencyLabel = getProficiencyLabel(skill.proficiency)
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{skill.name}</span>
                        {getTrendIcon(skill.trend)}
                      </div>
                      <Badge variant="outline" className={cn("text-xs", proficiencyLabel.color)}>
                        {proficiencyLabel.text}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={skill.proficiency} className="h-1.5 flex-1" />
                      <span className={cn("text-sm font-bold", proficiencyLabel.color)}>
                        {skill.proficiency}%
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No skills added yet</p>
              <Link href="/dashboard/student/portfolio">
                <Button variant="link" size="sm" className="mt-2 text-primary">
                  Add Skills <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* Weak Skills Warning */}
          {weakSkills.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-600">
                <Target className="w-4 h-4" />
                <span className="text-xs font-bold">
                  {weakSkills.length} skills need improvement
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}