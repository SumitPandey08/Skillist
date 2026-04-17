'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ATSTemplate } from '@/components/resume/ats-template'
import { tailorResume } from '@/app/jobs/_actions'
import { Loader2, FileDown, Sparkles, Wand2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ResumeTailor({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [isPending, startTransition] = React.useTransition()
  const [tailoredData, setTailoredData] = React.useState<any>(null)

  async function handleTailor() {
    startTransition(async () => {
      try {
        const result = await tailorResume(jobId)
        setTailoredData(result)
      } catch (error) {
        console.error('Tailoring error:', error)
      }
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          ATS Resume Tailoring
        </CardTitle>
        <CardDescription>
          AI will optimize your profile descriptions to match the <strong>{jobTitle}</strong> role.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!tailoredData ? (
          <Button 
            onClick={handleTailor} 
            disabled={isPending} 
            className="w-full h-12 gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Tailoring Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Tailor my Resume for this Job
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-700 border border-green-100 rounded-lg text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Resume tailored successfully! Ready for download.
            </div>
            
            <PDFDownloadLink
              document={<ATSTemplate data={tailoredData} />}
              fileName={`Resume-${tailoredData.personalInfo?.name?.replace(/\s+/g, '-') || 'resume'}-${jobTitle.replace(/\s+/g, '-')}.pdf`}
            >
              {({ loading }) => (
                <Button className="w-full h-12 gap-2" variant="default" disabled={loading}>
                  <FileDown className="h-5 w-5" />
                  {loading ? 'Preparing PDF...' : 'Download Tailored Resume'}
                </Button>
              )}
            </PDFDownloadLink>
            
            <Button variant="outline" className="w-full" onClick={() => setTailoredData(null)}>
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
