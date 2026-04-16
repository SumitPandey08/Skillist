import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <div className="p-6 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/30 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-foreground/90">Top Skills</h3>
        <Link href="/dashboard/student/portfolio" className="text-xs font-semibold text-primary hover:underline">View All</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.slice(0, 8).map(skill => (
            <span key={skill.id} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-muted/60 hover:bg-primary/15 hover:text-primary text-muted-foreground transition-all duration-200 cursor-default">
              {skill.name}
            </span>
          ))
        ) : (
          <p className="text-sm text-muted-foreground/70">No skills added yet.</p>
        )}
      </div>
    </div>
  )
}
