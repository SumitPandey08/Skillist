import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Skill {
  id: string
  name: string
  proficiency: string | null
}

interface TopSkillsProps {
  skills: Skill[]
}

export function TopSkills({ skills }: TopSkillsProps) {
  return (
    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-background to-muted/20 border border-border/40 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tight">Top Proficiencies</h3>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Verified technical expertise</p>
        </div>
        <Link href="/dashboard/student/portfolio">
          <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl">View All</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {skills.length > 0 ? (
          skills.slice(0, 10).map(skill => (
            <div key={skill.id} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight bg-background border border-border/40 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-300 cursor-default shadow-sm group/skill flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-40 group-hover/skill:opacity-100 transition-opacity" />
              {skill.name}
            </div>
          ))
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 opacity-40 w-full">
            <Sparkles className="w-10 h-10 text-muted-foreground" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Skill tree is empty</p>
          </div>
        )}
      </div>
    </div>
  )
}
