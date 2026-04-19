'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Code2, ExternalLink, Trophy, Brain, Zap, 
  ArrowRight, Search, LayoutGrid, CheckCircle2, 
  Clock, BookOpen, Star, Binary, GitBranch, ListTree
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LeetCodeStats } from '@/lib/integrations/leetcode'

const DSA_TOPICS = [
  {
    title: 'Arrays & Hashing',
    icon: LayoutGrid,
    description: 'Master fundamental data structures and hash map patterns.',
    difficulty: 'Beginner',
    leetcodeUrl: 'https://leetcode.com/tag/array/',
    problems: 2400
  },
  {
    title: 'Linked Lists',
    icon: ListTree,
    description: 'Understand pointers and sequential data traversal.',
    difficulty: 'Beginner',
    leetcodeUrl: 'https://leetcode.com/tag/linked-list/',
    problems: 800
  },
  {
    title: 'Trees & Graphs',
    icon: GitBranch,
    description: 'Deep dive into recursive algorithms and traversal strategies.',
    difficulty: 'Intermediate',
    leetcodeUrl: 'https://leetcode.com/tag/tree/',
    problems: 1200
  },
  {
    title: 'Dynamic Programming',
    icon: Zap,
    description: 'Optimize solutions using memoization and tabulation.',
    difficulty: 'Advanced',
    leetcodeUrl: 'https://leetcode.com/tag/dynamic-programming/',
    problems: 950
  },
  {
    title: 'Bit Manipulation',
    icon: Binary,
    description: 'Perform efficient calculations at the machine level.',
    difficulty: 'Intermediate',
    leetcodeUrl: 'https://leetcode.com/tag/bit-manipulation/',
    problems: 400
  },
  {
    title: 'Sorting & Searching',
    icon: Search,
    description: 'Understand time complexity and efficient data retrieval.',
    difficulty: 'Beginner',
    leetcodeUrl: 'https://leetcode.com/tag/sorting/',
    problems: 1500
  }
]

interface DSAContentProps {
  leetcodeStats: LeetCodeStats | null
  leetcodeUsername: string | null
}

export function DSAContent({ leetcodeStats, leetcodeUsername }: DSAContentProps) {
  const stats = [
    { 
      label: 'Problems Solved', 
      value: leetcodeStats?.totalSolved?.toString() || '0', 
      icon: CheckCircle2, 
      color: 'text-emerald-500',
      subtext: leetcodeStats ? `${leetcodeStats.easySolved} E / ${leetcodeStats.mediumSolved} M / ${leetcodeStats.hardSolved} H` : 'Connect LeetCode'
    },
    { 
      label: 'Global Ranking', 
      value: leetcodeStats?.ranking ? `#${leetcodeStats.ranking.toLocaleString()}` : 'N/A', 
      icon: Trophy, 
      color: 'text-amber-500',
      subtext: leetcodeStats ? 'Top Tier Talent' : 'Not Connected'
    },
    { 
      label: 'Contest Rating', 
      value: leetcodeStats?.contestRating ? Math.floor(leetcodeStats.contestRating).toString() : 'N/A', 
      icon: Zap, 
      color: 'text-blue-500',
      subtext: leetcodeStats?.contestRating ? 'Active Competitor' : 'No Rating'
    },
    { 
      label: 'Skill Match', 
      value: leetcodeStats ? 'High' : 'Low', 
      icon: Brain, 
      color: 'text-purple-500',
      subtext: 'Based on DSA'
    }
  ]

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4 max-w-3xl">
          <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5" /> Algorithms Lab
          </motion.div>
          <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-none"
          >
              DSA <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Mastery</span>
          </motion.h1>
          <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg sm:text-xl font-medium leading-relaxed"
          >
            {leetcodeUsername 
              ? `Tracking progress for ${leetcodeUsername}. Systematic preparation for technical interviews.`
              : 'Systematic preparation for technical interviews. Track your progress across core patterns and algorithms.'
            }
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 bg-background/40 backdrop-blur-xl p-2 rounded-[2rem] border border-border/40 shadow-xl"
        >
          {leetcodeUsername ? (
            <Button 
              className="rounded-full h-14 px-8 font-black gap-3 bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-500/30 transition-all group"
              onClick={() => window.open(`https://leetcode.com/${leetcodeUsername}/`, '_blank')}
            >
              <Trophy className="w-5 h-5 fill-current" />
              LeetCode Profile
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          ) : (
            <Button 
              className="rounded-full h-14 px-8 font-black gap-3 bg-amber-600 hover:bg-amber-700 shadow-2xl shadow-amber-500/30 transition-all group"
              onClick={() => window.location.href = '/dashboard/profile'}
            >
              <Star className="w-5 h-5 fill-current" />
              Connect LeetCode
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </motion.div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
              <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
              >
                  <Card className="border-2 border-border/30 bg-background/50 backdrop-blur-xl rounded-[2rem] hover:border-emerald-500/20 transition-all overflow-hidden group">
                      <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                          <CardTitle className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em]">
                              {stat.label}
                          </CardTitle>
                          <stat.icon className={cn("w-4 h-4", stat.color)} />
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                          <div className="text-3xl font-black">{stat.value}</div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{stat.subtext}</p>
                      </CardContent>
                  </Card>
              </motion.div>
          ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
          {/* Topic Grid */}
          <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                      <Brain className="w-6 h-6 text-emerald-600" /> Pattern Library
                  </h2>
                  <Badge variant="outline" className="rounded-full px-4 py-1 font-bold">6 Core Topics</Badge>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                  {DSA_TOPICS.map((topic, i) => (
                      <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                      >
                          <Card className="border-2 border-border/30 bg-background/50 backdrop-blur-xl rounded-[2.5rem] hover:border-emerald-500/20 transition-all group relative overflow-hidden h-full flex flex-col">
                              <CardHeader className="p-8 pb-4">
                                  <div className="p-3 w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                      <topic.icon className="w-7 h-7 text-emerald-600" />
                                  </div>
                                  <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                          <CardTitle className="text-2xl font-black tracking-tight">{topic.title}</CardTitle>
                                          <Badge className={cn(
                                              "text-[8px] font-black uppercase tracking-widest px-2 py-0.5",
                                              topic.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600' :
                                              topic.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-600' :
                                              'bg-amber-500/10 text-amber-600'
                                          )}>
                                              {topic.difficulty}
                                          </Badge>
                                      </div>
                                      <p className="text-muted-foreground text-sm font-medium leading-relaxed line-clamp-2">
                                          {topic.description}
                                      </p>
                                  </div>
                              </CardHeader>
                              <CardContent className="p-8 pt-0 mt-auto">
                                  <div className="flex items-center justify-between pt-6 border-t border-border/20">
                                      <div className="text-xs font-bold text-muted-foreground">
                                          <span className="text-foreground">{topic.problems}+</span> Problems
                                      </div>
                                      <Button 
                                          variant="ghost" 
                                          className="rounded-xl h-10 gap-2 font-black text-xs hover:bg-emerald-500 hover:text-white transition-all"
                                          onClick={() => window.open(topic.leetcodeUrl, '_blank')}
                                      >
                                          Practice <ExternalLink className="w-3.5 h-3.5" />
                                      </Button>
                                  </div>
                              </CardContent>
                          </Card>
                      </motion.div>
                  ))}
              </div>
          </div>

          {/* Sidebar Resources */}
          <div className="lg:col-span-4 space-y-8">
              {/* External Tools */}
              <div className="space-y-6">
                  <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                      <Star className="w-6 h-6 text-amber-500" /> Power Tools
                  </h2>
                  <div className="space-y-4">
                      {[
                          { name: 'NeetCode.io', desc: 'Visual algorithm explanations and roadmap.', url: 'https://neetcode.io/' },
                          { name: 'Visualgo', desc: 'Interactive algorithm visualizations.', url: 'https://visualgo.net/' },
                          { name: 'GeeksforGeeks', desc: 'Detailed documentation on every data structure.', url: 'https://www.geeksforgeeks.org/' }
                      ].map((tool, i) => (
                          <motion.div
                              key={i}
                              whileHover={{ x: 4 }}
                              className="p-6 rounded-[2rem] bg-muted/30 border-2 border-border/10 hover:border-emerald-500/20 transition-all cursor-pointer group"
                              onClick={() => window.open(tool.url, '_blank')}
                          >
                              <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-black text-lg group-hover:text-emerald-600 transition-colors">{tool.name}</h3>
                                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                              </div>
                              <p className="text-xs font-medium text-muted-foreground leading-relaxed">{tool.desc}</p>
                          </motion.div>
                      ))}
                  </div>
              </div>

              {/* AI Study Buddy CTA */}
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                      <Brain size={150} fill="white" />
                  </div>
                  <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-black tracking-tight">Pattern Analysis</h3>
                      <p className="text-emerald-100 font-medium leading-relaxed">
                          Run a diagnostic to see which DSA patterns you need to focus on for your target role.
                      </p>
                      <Button 
                          className="w-full rounded-2xl h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-black px-8 mt-4 shadow-xl"
                          onClick={() => window.location.href = '/dashboard/student/analysis'}
                      >
                          Start AI Diagnostic
                          <Zap className="ml-2 w-4 h-4 fill-current" />
                      </Button>
                  </div>
              </div>

              {/* Recommended Courses */}
              <div className="p-8 rounded-[2.5rem] bg-background border-2 border-border/30 space-y-6">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">Curated Learning</h4>
                  <div className="space-y-4">
                      <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                              <BookOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                              <p className="text-sm font-black">Algorithmic Design</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">MIT OpenCourseWare</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                              <BookOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                              <p className="text-sm font-black">Data Structures</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Princeton University</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}
