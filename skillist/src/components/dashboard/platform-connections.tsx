'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Code2, Trophy, Loader2 } from 'lucide-react'

// Custom Github SVG since Lucide removed brand icons
function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

// Custom Linkedin SVG since Lucide removed brand icons
function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
import { updatePlatformConnections } from '@/app/dashboard/_actions'
import { useAuth } from '@clerk/nextjs'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PlatformConnectionsProps {
  initialData: {
    githubUrl: string | null
    leetcodeUrl: string | null
    codeforcesUrl: string | null
    linkedinUrl: string | null
    githubUsername: string | null
    leetcodeUsername: string | null
    codeforcesUsername: string | null
  }
}

export function PlatformConnections({ initialData }: PlatformConnectionsProps) {
  const [isPending, startTransition] = React.useTransition()
  const [isSyncing, setIsSyncing] = React.useState(false)
  const { getToken } = useAuth()
  const router = useRouter()

  async function handleSync() {
    setIsSyncing(true)
    try {
      const token = await getToken()
      const response = await fetch('/api/backend/integrations/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Sync failed: ${response.status} ${errData.error || response.statusText}`);
      }
      router.refresh()
      alert('Data sync completed!')
    } catch (error) {
      console.error('Failed to sync:', error)
      alert('Failed to trigger sync. Please try again.')
    } finally {
      setIsSyncing(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    const data = {
      githubUrl: formData.get('github') as string,
      leetcodeUrl: formData.get('leetcode') as string,
      codeforcesUrl: formData.get('codeforces') as string,
      linkedinUrl: formData.get('linkedin') as string,
    }

    startTransition(async () => {
      try {
        await updatePlatformConnections(data)
      } catch (error) {
        console.error('Failed to update connections:', error)
      }
    })
  }

  return (
    <Card className="shadow-sm border-primary/20 bg-background/50 backdrop-blur-md rounded-[2rem]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Github className="h-6 w-6 text-primary" />
            </div>
            Connect Platforms
          </CardTitle>
          <CardDescription className="text-base font-medium">
            Link your professional profiles to improve your AI Match Score and visibility.
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSync} 
          disabled={isSyncing || (!initialData.githubUsername && !initialData.leetcodeUsername && !initialData.codeforcesUsername)}
          className="rounded-full h-10 px-4 font-bold border-primary/20 hover:bg-primary/5"
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Sync Stats
        </Button>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <form action={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                <Linkedin className="h-4 w-4 text-[#0077b5]" /> LinkedIn Profile URL
              </Label>
              <Input 
                id="linkedin" 
                name="linkedin" 
                placeholder="https://linkedin.com/in/yourname" 
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary/50 transition-all"
                defaultValue={initialData.linkedinUrl || ''} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                <Github className="h-4 w-4" /> GitHub Profile URL
              </Label>
              <Input 
                id="github" 
                name="github" 
                placeholder="https://github.com/yourusername" 
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary/50 transition-all"
                defaultValue={initialData.githubUrl || ''} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leetcode" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                <Code2 className="h-4 w-4 text-[#FFA116]" /> LeetCode Profile URL
              </Label>
              <Input 
                id="leetcode" 
                name="leetcode" 
                placeholder="https://leetcode.com/yourusername" 
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary/50 transition-all"
                defaultValue={initialData.leetcodeUrl || ''} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codeforces" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                <Trophy className="h-4 w-4 text-[#318CE7]" /> Codeforces Profile URL
              </Label>
              <Input 
                id="codeforces" 
                name="codeforces" 
                placeholder="https://codeforces.com/profile/yourusername" 
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary/50 transition-all"
                defaultValue={initialData.codeforcesUrl || ''} 
              />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Updating Connections...
              </>
            ) : 'Save & Update Profiles'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
