'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus } from 'lucide-react'
import { addSkill, removeSkill } from '@/app/dashboard/_actions'

interface Skill {
  id: string
  name: string
  proficiency: string
}

export function SkillsSection({ initialSkills }: { initialSkills: Skill[] }) {
  const [isAdding, setIsAdding] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  async function handleAdd(formData: FormData) {
    startTransition(async () => {
      await addSkill({
        name: formData.get('name') as string,
        proficiency: formData.get('proficiency') as 'beginner' | 'intermediate' | 'advanced',
      })
      setIsAdding(false)
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Manage your technical and soft skills.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-1">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input id="skill-name" name="name" placeholder="e.g. React" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="proficiency">Proficiency</Label>
              <Select name="proficiency" defaultValue="beginner">
                <SelectTrigger id="proficiency">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? 'Adding...' : 'Add'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {initialSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          ) : (
            initialSkills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="pl-3 pr-1 py-1 gap-2 text-sm">
                {skill.name}
                <span className="text-[10px] uppercase font-bold opacity-60">({skill.proficiency})</span>
                <button 
                  onClick={() => removeSkill(skill.id)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
