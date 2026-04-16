'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SkillTagInput } from '@/components/jobs/skill-tag-input'
import { updateJob } from '@/app/dashboard/_actions'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  jobType: z.string().optional(),
  skills: z.array(z.object({
    id: z.string(),
    text: z.string()
  })).min(1, 'At least one skill is required')
})

interface EditJobFormProps {
  jobId: string
  initialData: z.infer<typeof formSchema>
}

export function EditJobForm({ jobId, initialData }: EditJobFormProps) {
  const [isPending, startTransition] = React.useTransition()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await updateJob(jobId, values)
      } catch (error) {
        console.error('Error updating job:', error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Frontend Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the role, responsibilities, and requirements..." 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New York, NY or Remote" {...field} />
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
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Full-time, Contract" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="salaryRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary Range (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. $120k - $150k" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SkillTagInput 
          name="skills" 
          label="Required Skills" 
          placeholder="Type a skill and press Enter"
        />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" type="button" render={<Link href="/dashboard/company/jobs" />}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
