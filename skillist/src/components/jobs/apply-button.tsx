'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { applyToJob } from '@/app/jobs/_actions'
import { Loader2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ApplyButtonProps {
  jobId: string
  existingApplication?: any
}

export function ApplyButton({ jobId, existingApplication }: ApplyButtonProps) {
  const [isPending, startTransition] = React.useTransition()
  const [application, setApplication] = React.useState(existingApplication)
  const [error, setError] = React.useState<string | null>(null)

  async function handleApply() {
    setError(null)
    startTransition(async () => {
      try {
        const result = await applyToJob(jobId)
        if (result.success) {
          setApplication(result.scores)
        } else {
          setError(result.message || 'Application failed')
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      }
    })
  }

  if (application) {
    const score = application.matchScore ?? application.totalScore
    
    return (
      <Card className="border-primary/20 bg-primary/5 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Applied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Match Score</span>
              <span className="text-primary font-bold">{score}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
          
          <div className="p-3 bg-white/50 rounded-lg text-[11px] leading-relaxed italic text-muted-foreground border">
            "{application.analysis}"
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full text-xs gap-2" 
              nativeButton={false}
              render={<a href={`/jobs/${jobId}/tailor`} />}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Tailor Resume for this Job
            </Button>
          </div>
          
          <p className="text-[10px] text-center text-muted-foreground">
            Your profile has been shared with the employer.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      
      <Button 
        className="w-full text-lg h-12 gap-2" 
        onClick={handleApply}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Calculating Match...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Apply with Skillist
          </>
        )}
      </Button>
    </div>
  )
}
