'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Copy, ExternalLink, Share2 } from 'lucide-react'

export function SharePortfolio({ slug }: { slug: string }) {
  const [copied, setCopied] = React.useState(false)
  
  const portfolioUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/portfolio/${slug}`
    : `/portfolio/${slug}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Share Your Portfolio
        </CardTitle>
        <CardDescription>Share this URL with recruiters and on your social profiles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            readOnly 
            value={portfolioUrl} 
            className="bg-muted text-xs font-mono"
          />
          <Button size="icon" variant="outline" onClick={copyToClipboard} title="Copy to clipboard">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            nativeButton={false}
            render={
              <a href={`/portfolio/${slug}`} target="_blank" rel="noopener noreferrer" title="View Public Portfolio" />
            }
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
