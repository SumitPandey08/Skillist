'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileUp, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { uploadAndParseResume } from './_actions'
import { Badge } from '@/components/ui/badge'

export function ResumeUpload() {
  const [isPending, setIsPending] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = formData.get('resume') as File

    if (!file || file.size === 0) return

    setIsPending(true)
    setStatus('idle')
    
    try {
      const result = await uploadAndParseResume(formData)
      if (result.success) {
        setStatus('success')
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setStatus('error')
      setErrorMessage(error.message || 'Something went wrong during parsing.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Import Skills
        </h3>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-semibold px-1.5">AI</Badge>
      </div>
      
      <form onSubmit={handleUpload} className="space-y-3">
        <div className="relative group">
          <label 
            htmlFor="resume" 
            className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border/40 rounded-2xl bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-4 pb-4">
              <div className="p-2 rounded-lg bg-primary/10 mb-2 group-hover:scale-105 transition-transform">
                <FileUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground">
                Drop resume or click to browse
              </p>
              <p className="text-[9px] text-muted-foreground/50 mt-0.5">
                PDF (Max 5MB)
              </p>
            </div>
            <Input 
              id="resume" 
              name="resume" 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              disabled={isPending}
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  e.target.form?.requestSubmit()
                }
              }}
              required
            />
          </label>
        </div>
        
        {isPending && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
            <p className="text-xs font-semibold text-primary">Parsing with AI...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-xs font-semibold text-green-600 flex-1">Sync Complete</p>
            <Button variant="ghost" size="sm" onClick={() => setStatus('idle')} className="h-6 text-xs text-green-600 hover:bg-green-500/10">
              Reset
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-xs font-semibold text-destructive flex-1 truncate">Parsing Failed</p>
            <Button variant="ghost" size="sm" onClick={() => setStatus('idle')} className="h-6 text-xs text-destructive hover:bg-destructive/10">
              Retry
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
