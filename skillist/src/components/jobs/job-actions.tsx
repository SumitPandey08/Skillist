'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Power, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { deleteJob, updateJobStatus } from '@/app/dashboard/_actions'

export function JobActions({ jobId, status }: { jobId: string; status: string }) {
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="border-t md:border-t-0 md:border-l bg-slate-50/50 dark:bg-slate-950/50 p-4 flex md:flex-col justify-end md:justify-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start border-primary/20 hover:bg-primary/5" 
        nativeButton={false}
        render={<Link href={`/employer/candidates?jobId=${jobId}`} />}
      >
        <Users className="h-4 w-4 mr-2" /> View Applicants
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start" 
        nativeButton={false}
        render={<Link href={`/employer/jobs/${jobId}/edit`} />}
      >
        <Edit className="h-4 w-4 mr-2" /> Edit
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await updateJobStatus(jobId, status === 'active' ? 'closed' : 'active')
          })
        }}
      >
        <Power className="h-4 w-4 mr-2" /> 
        {isPending ? 'Updating...' : (status === 'active' ? 'Close Job' : 'Reactivate')}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        disabled={isPending}
        onClick={() => {
          if (confirm('Are you sure you want to delete this job?')) {
            startTransition(async () => {
              await deleteJob(jobId)
            })
          }
        }}
      >
        <Trash2 className="h-4 w-4 mr-2" /> {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
