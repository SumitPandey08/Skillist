'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, AlertTriangle, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Application {
  id: string
  jobTitle: string
  companyName: string
  status: string
  matchScore: number
}

export function SmartApplicationInsights({ applications }: { applications: Application[] }) {
  const recent = applications.slice(0, 2)
  
  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-lg rounded-3xl overflow-hidden h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" /> Application Insights
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length > 0 ? (
          recent.map(app => (
            <div key={app.id} className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm truncate">{app.jobTitle}</h3>
                  <p className="text-xs text-muted-foreground">{app.companyName}</p>
                </div>
                <Badge variant={app.status === 'rejected' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-black">
                  {app.status}
                </Badge>
              </div>
              
              {app.status === 'rejected' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-rose-600">Low match score ({app.matchScore}%)</p>
                    <p className="text-[10px] text-rose-700/80">Improve React to increase chances here.</p>
                  </div>
                </div>
              )}
              {app.status !== 'rejected' && (
                 <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-2">
                 <Lightbulb className="w-4 h-4 text-blue-500 shrink-0" />
                 <div>
                   <p className="text-xs font-bold text-blue-600">Strong potential ({app.matchScore}%)</p>
                   <p className="text-[10px] text-blue-700/80">Your DSA skills stand out for this role.</p>
                 </div>
               </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground italic text-center py-4">No applications sent yet.</div>
        )}
      </CardContent>
    </Card>
  )
}
