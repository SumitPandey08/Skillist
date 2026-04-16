'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { updateBio } from '@/app/dashboard/_actions'

export function BioEditor({ initialBio }: { initialBio: string | null }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateBio(formData.get('bio') as string)
      setIsEditing(false)
    })
  }

  if (isEditing) {
    return (
      <form action={handleSubmit} className="space-y-4">
        <Textarea 
          name="bio" 
          defaultValue={initialBio || ''} 
          placeholder="Write a short professional bio..." 
          className="min-h-[150px]"
          required
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Bio'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-lg leading-relaxed italic text-muted-foreground">
        {initialBio || "No bio added yet. Click edit to add one!"}
      </p>
      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
        Edit Bio
      </Button>
    </div>
  )
}
