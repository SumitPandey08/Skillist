'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderGit2, Star, Zap, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Project {
  id: string
  title: string
  description?: string | null
  technologies?: string[] // Assuming we might have this or can parse it
}

export function ProjectImpactCard({ projects }: ProjectImpactCardProps) {
  const displayProjects = projects.slice(0, 2)

  const getImpactData = (project: Project) => {
    const desc = project.description || ''
    const techCount = (project as any).technologies?.length || (desc.match(/,/g) || []).length + 1
    
    // Heuristic for impact
    let stars = 3
    if (desc.length > 200) stars++
    if (techCount > 3) stars++
    stars = Math.min(5, stars)

    const boost = 5 + (stars * 2) + (techCount > 2 ? 3 : 0)

    return { stars, boost, level: stars > 4 ? 'Elite' : 'Advanced' }
  }

  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-lg rounded-3xl overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-500" /> Project Impact
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {displayProjects.length > 0 ? (
          displayProjects.map((project, idx) => {
            const data = getImpactData(project)
            return (
              <div key={project.id} className="p-4 rounded-2xl bg-muted/30 border border-border/40 group hover:border-indigo-500/30 transition-all">
                <h3 className="font-bold text-base truncate mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-[9px] uppercase font-black">AI Analysis</Badge>
                  <span className="text-xs text-muted-foreground font-bold">{data.level}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-3 h-3", 
                          i < data.stars ? "fill-amber-500 text-amber-500" : "text-muted"
                        )} 
                      />
                    ))}
                    <span className="text-[10px] font-bold text-muted-foreground ml-1">Recruiter Value</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs font-black">+{data.boost}% Match</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-sm text-muted-foreground italic text-center py-8">No projects added yet.</div>
        )}

        <div className="pt-2">
          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10 transition-colors text-xs font-black uppercase tracking-widest">
            Improve a Project <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

import { cn } from '@/lib/utils'

