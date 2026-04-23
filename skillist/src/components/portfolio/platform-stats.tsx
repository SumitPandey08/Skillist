'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2, Trophy, Star, Users, CheckCircle2, Award, Zap, Globe, GitBranch } from 'lucide-react'
import { Github } from '@/components/icons'
import { GitHubStats } from '@/lib/integrations/github'
import { LeetCodeStats } from '@/lib/integrations/leetcode'
import { CodeforcesStats } from '@/lib/integrations/codeforces'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface PlatformStatsProps {
  github?: GitHubStats | null
  leetcode?: LeetCodeStats | null
  codeforces?: CodeforcesStats | null
}

export function PlatformStats({ github, leetcode, codeforces }: PlatformStatsProps) {
  if (!github && !leetcode && !codeforces) return null

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {github && (
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="bg-card border-border/50 shadow-2xl rounded-[2rem] overflow-hidden group">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Github className="w-16 h-16" />
              </div>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Repositories</div>
                  <div className="text-2xl font-black text-foreground">{github.publicRepos}</div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Total Stars</div>
                  <div className="text-2xl font-black text-foreground">{github.totalStars}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary" /> Active Stack
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {github.topLanguages.map(lang => (
                    <span key={lang} className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {leetcode && (
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="bg-card border-border/50 shadow-2xl rounded-[2rem] overflow-hidden group">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Code2 className="w-16 h-16 text-amber-500" />
              </div>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Code2 className="h-4 w-4 text-amber-500" /> Algorithmic Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Solved</div>
                  <div className="text-2xl font-black text-amber-500">{leetcode.totalSolved}</div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">World Rank</div>
                  <div className="text-xl font-black text-foreground">#{leetcode.ranking > 1000 ? `${(leetcode.ranking / 1000).toFixed(1)}k` : leetcode.ranking}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    <span>Proficiency Heatmap</span>
                    <span className="text-amber-500 font-black">Peak Performance</span>
                </div>
                <div className="h-2 flex bg-muted rounded-full overflow-hidden shadow-inner">
                  <div className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${(leetcode.easySolved / leetcode.totalSolved) * 100}%` }} />
                  <div className="bg-amber-500 h-full shadow-[0_0_10px_rgba(245,158,11,0.3)]" style={{ width: `${(leetcode.mediumSolved / leetcode.totalSolved) * 100}%` }} />
                  <div className="bg-rose-500 h-full shadow-[0_0_10px_rgba(244,63,94,0.3)]" style={{ width: `${(leetcode.hardSolved / leetcode.totalSolved) * 100}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {codeforces && (
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="bg-card border-border/50 shadow-2xl rounded-[2rem] overflow-hidden group">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-16 h-16 text-indigo-500" />
              </div>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4 text-indigo-500" /> Competitive Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center relative overflow-hidden">
                <div className="absolute -bottom-2 -right-2 opacity-10">
                    <Star className="w-12 h-12 text-indigo-400" />
                </div>
                <div className="text-[10px] text-indigo-500/70 dark:text-indigo-300 uppercase font-black tracking-[0.3em] mb-2">Elo Rating</div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tighter">
                  {codeforces.rating}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl">
                        <Award className="h-5 w-5 text-orange-500" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-foreground">{codeforces.rank}</span>
                </div>
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 dark:text-indigo-400 font-black text-[8px] uppercase tracking-widest bg-indigo-500/5">Global Elite</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
