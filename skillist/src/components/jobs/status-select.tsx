'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateApplicationStatus } from '@/app/dashboard/_actions'
import { Loader2 } from 'lucide-react'

const statuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
]

export function StatusSelect({ appId, currentStatus }: { appId: string; currentStatus: string }) {
  const [isPending, startTransition] = React.useTransition()

  function handleStatusChange(value: string) {
    startTransition(async () => {
      try {
        await updateApplicationStatus(appId, value)
      } catch (error) {
        console.error('Failed to update status:', error)
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Pipeline Status:</span>
      <div className="relative w-40">
        <Select
          defaultValue={currentStatus}
          onValueChange={handleStatusChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isPending && (
          <div className="absolute -right-8 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
