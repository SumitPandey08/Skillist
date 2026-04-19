'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Zap, Briefcase, Loader2, Wand2 } from 'lucide-react'
import { SkillTagInput } from '@/components/jobs/skill-tag-input'
import { type Tag } from 'emblor'
import { createJobAction, generateJobDescriptionAction } from '@/app/(dashboard)/employer/jobs/_actions'
import { toast } from 'sonner'

const jobSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  location: z.string().min(2, 'Location is required'),
  salaryRange: z.string().min(2, 'Salary range is required'),
  jobType: z.string(),
  description: z.string().min(10, 'Description is too short'),
  skills: z.array(z.object({
    id: z.string(),
    text: z.string()
  })).min(1, 'Add at least one skill')
})

type JobFormValues = z.infer<typeof jobSchema>

export function JobForm() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      location: '',
      salaryRange: '',
      jobType: 'full-time',
      description: '',
      skills: []
    }
  })

  async function onGenerate() {
    const title = form.getValues('title')
    const skills = form.getValues('skills').map(s => s.text)
    const location = form.getValues('location')

    if (!title || skills.length === 0) {
      alert('Please provide a job title and at least one skill first.')
      return
    }

    setIsGenerating(true)
    try {
      const res = await generateJobDescriptionAction({ title, skills, location })
      if (res.error) {
        alert(res.error)
      } else if (res.description) {
        form.setValue('description', res.description)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true)
    try {
      const skills = values.skills.map(s => s.text)
      const res = await createJobAction({
        ...values,
        skills
      })
      if (res?.error) {
        alert(res.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior Frontend Engineer" {...field} className="bg-background/40 h-12 text-lg font-bold border-border/40 focus:ring-indigo-500/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Remote / New York" {...field} className="bg-background/40 h-12 font-medium border-border/40 focus:ring-indigo-500/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="salaryRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. $120k - $160k" {...field} className="bg-background/40 h-12 font-medium border-border/40 focus:ring-indigo-500/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Employment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background/40 h-12 font-medium border-border/40 focus:ring-indigo-500/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border-border shadow-2xl">
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-6">
          <SkillTagInput 
            name="skills" 
            label="Required Skills Matrix" 
            placeholder="Add skills (React, Node, etc)..." 
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Job Description</FormLabel>
            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-9 px-4 rounded-xl border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all gap-2"
                onClick={onGenerate}
                disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              Magic Generate with AI
            </Button>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the role and impact..." 
                    {...field} 
                    className="min-h-[300px] bg-background/40 font-medium border-border/40 focus:ring-indigo-500/50 resize-y rounded-2xl p-6" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-500/20 group transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Briefcase className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
            Publish Role & Activate Pipeline
          </Button>
        </div>
      </form>
    </Form>
  )
}
