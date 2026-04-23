'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Play, Clock, ArrowRight, Sparkles, Target, Zap, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LearningResource {
  id: string
  title: string
  type: 'video' | 'article' | 'project' | 'course'
  duration: string
  skill: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  matchScore: number
  url: string
}

interface AILearningFeedProps {
  targetSkills?: string[]
}

export function AILearningFeed({ targetSkills = [] }: AILearningFeedProps) {
  const [resources, setResources] = useState<LearningResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // AI-curated learning resources based on target skills
    const mockResources: LearningResource[] = [
      {
        id: '1',
        title: 'Building REST APIs with Node.js',
        type: 'video',
        duration: '45 min',
        skill: 'Node.js',
        difficulty: 'intermediate',
        matchScore: 92,
        url: '#'
      },
      {
        id: '2',
        title: 'System Design Fundamentals',
        type: 'course',
        duration: '2 hours',
        skill: 'System Design',
        difficulty: 'advanced',
        matchScore: 88,
        url: '#'
      },
      {
        id: '3',
        title: 'Build a Real-time Chat App',
        type: 'project',
        duration: '1.5 hours',
        skill: 'Full Stack',
        difficulty: 'intermediate',
        matchScore: 85,
        url: '#'
      },
      {
        id: '4',
        title: 'React Performance Optimization',
        type: 'article',
        duration: '15 min',
        skill: 'React',
        difficulty: 'advanced',
        matchScore: 78,
        url: '#'
      }
    ]
    
    setTimeout(() => {
      setResources(mockResources)
      setLoading(false)
    }, 300)
  }, [targetSkills])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-3 h-3" />
      case 'article': return <BookOpen className="w-3 h-3" />
      case 'project': return <Zap className="w-3 h-3" />
      case 'course': return <Target className="w-3 h-3" />
      default: return <BookOpen className="w-3 h-3" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'article': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'project': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'course': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'advanced': return 'text-red-500'
      case 'intermediate': return 'text-amber-500'
      default: return 'text-green-500'
    }
  }

  if (loading) {
    return (
      <Card className="border border-border/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Learning Feed
            </CardTitle>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Personalized
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.map((resource, idx) => (
            <motion.a
              key={resource.id}
              href={resource.url}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="block p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group border border-transparent hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={cn("text-[10px]", getTypeColor(resource.type))}>
                      {getTypeIcon(resource.type)}
                      <span className="ml-1 capitalize">{resource.type}</span>
                    </Badge>
                    <span className={cn("text-[10px] font-bold uppercase", getDifficultyColor(resource.difficulty))}>
                      {resource.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                    {resource.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {resource.duration}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {resource.skill}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-green-500">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs font-bold">{resource.matchScore}%</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.a>
          ))}

          {/* CTA */}
          <Link href="/dashboard/student/roadmap">
            <Button variant="ghost" className="w-full mt-2 text-xs">
              View Full Learning Path
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}