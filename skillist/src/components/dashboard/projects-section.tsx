'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, ExternalLink, Calendar, Plus } from 'lucide-react'
import { addProject, deleteProject } from '@/app/dashboard/_actions'

interface Project {
  id: string
  title: string
  description: string | null
  url: string | null
  startDate: Date | null
  endDate: Date | null
}

export function ProjectsSection({ initialProjects }: { initialProjects: Project[] }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addProject({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        url: formData.get('url') as string,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
      })
      setIsOpen(false)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </DialogTrigger>
          <DialogContent>
            <form action={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Project</DialogTitle>
                <DialogDescription>Showcase your best work and what you achieved.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" name="title" placeholder="e.g. ECHFLUX Platform" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="What did you build? What technologies did you use?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Project URL</Label>
                  <Input id="url" name="url" placeholder="https://github.com/..." type="url" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input id="endDate" name="endDate" type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Save Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {initialProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-2">No projects added yet.</p>
        ) : (
          initialProjects.map((project) => (
            <Card key={project.id} className="group relative">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} 
                    {' — '}
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm line-clamp-3">{project.description}</p>
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View Project <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
