'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2, Trophy, Star, Users, CheckCircle2, Award } from 'lucide-react'
import { Github } from '@/components/icons'
import { GitHubStats } from '@/lib/integrations/github'
import { LeetCodeStats } from '@/lib/integrations/leetcode'
import { CodeforcesStats } from '@/lib/integrations/codeforces'

interface PlatformStatsProps {
  github?: GitHubStats | null
  leetcode?: LeetCodeStats | null
  codeforces?: CodeforcesStats | null
}

export function PlatformStats({ github, leetcode, codeforces }: PlatformStatsProps) {
  if (!github && !leetcode && !codeforces) return null

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2">Verified Platform Stats</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {github && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Repos</div>
                  <div className="text-xl font-bold">{github.publicRepos}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Stars</div>
                  <div className="text-xl font-bold">{github.totalStars}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter mb-1">Top Languages</div>
                <div className="flex flex-wrap gap-1">
                  {github.topLanguages.map(lang => (
                    <span key={lang} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {leetcode && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Code2 className="h-4 w-4" /> LeetCode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Solved</div>
                  <div className="text-xl font-bold">{leetcode.totalSolved}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Ranking</div>
                  <div className="text-xl font-bold">#{leetcode.ranking.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-green-500 h-full" style={{ width: `${(leetcode.easySolved / leetcode.totalSolved) * 100}%` }} />
                  <div className="bg-orange-500 h-full" style={{ width: `${(leetcode.mediumSolved / leetcode.totalSolved) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(leetcode.hardSolved / leetcode.totalSolved) * 100}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {codeforces && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Codeforces
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Current Rating</div>
                <div className="text-2xl font-black text-primary">{codeforces.rating}</div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold capitalize">{codeforces.rank}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
