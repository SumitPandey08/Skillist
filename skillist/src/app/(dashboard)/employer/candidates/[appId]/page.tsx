import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { notFound, redirect } from 'next/navigation'
import { ScoreRadarChart } from '@/components/jobs/score-radar-chart'
import { ArrowLeft, Mail, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusSelect } from '@/components/jobs/status-select'

export default async function ApplicantDetailPage(
  props: { params: Promise<{ appId: string }> }
) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { appId } = await props.params

  let application;
  try {
    application = await fetchFromBackend(`/jobs/applications/${appId}`)
  } catch (error) {
    console.error('Failed to fetch application:', error)
    notFound()
  }

  const { job, student } = application
  const studentUser = student.user

  const chartData = {
    skills: application.skillScore || 0,
    experience: application.expScore || 0,
    projects: application.projScore || 0,
    potential: application.potentialScore || 0,
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href={`/employer/candidates`} className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Pipeline
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 glass p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="text-sm font-semibold text-indigo-400 mb-1">Applying for {job.title}</div>
            <h1 className="text-4xl font-extrabold tracking-tight">{student.name}</h1>
            <p className="text-xl text-muted-foreground font-medium">{student.primarySkill}</p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10"><Mail className="h-4 w-4 text-muted-foreground" /> {studentUser?.email}</span>
              {student.resumeUrl && (
                <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors font-medium">
                  <ExternalLink className="h-4 w-4" /> Original Resume
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-2xl min-w-[200px] relative z-10 backdrop-blur-md">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Overall Match</div>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">{application.matchScore}%</div>
            <div className="mt-6 w-full">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">Update Status</div>
              <StatusSelect appId={appId} currentStatus={application.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mt-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass border-white/5 shadow-xl">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                 <span className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400">AI</span>
                 Match Analysis
              </CardTitle>
              <CardDescription>Generated evaluation of the candidate's fit for this role.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-6 bg-black/20 rounded-xl italic leading-relaxed text-lg border border-white/5 shadow-inner">
                "{application.analysis || "AI analysis pending..."}"
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/5 shadow-xl">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle>Professional Bio</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                {student.bio || "No bio provided by the candidate."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass border-white/5 shadow-xl overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Visualizing categorical fit</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mx-auto max-w-[250px]">
                <ScoreRadarChart data={chartData} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Skills</div>
                  <div className="text-2xl font-black text-foreground">{chartData.skills}%</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Experience</div>
                  <div className="text-2xl font-black text-foreground">{chartData.experience}%</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Projects</div>
                  <div className="text-2xl font-black text-foreground">{chartData.projects}%</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Potential</div>
                  <div className="text-2xl font-black text-foreground">{chartData.potential}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
