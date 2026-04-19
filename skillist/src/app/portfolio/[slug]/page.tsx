import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Calendar, ExternalLink } from 'lucide-react'
import { fetchGitHubStats } from '@/lib/integrations/github'
import { fetchLeetCodeStats } from '@/lib/integrations/leetcode'
import { fetchCodeforcesStats } from '@/lib/integrations/codeforces'
import { PlatformStats } from '@/components/portfolio/platform-stats'
import { fetchFromBackend } from '@/lib/api-server'

async function getPortfolioData(slug: string) {
  try {
    const data = await fetchFromBackend(`/users/portfolio/${slug}`)
    return data.student
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params
  const student = await getPortfolioData(slug)

  if (!student) return { title: 'Not Found' }

  return {
    title: `${student.name} | Professional Portfolio`,
    description: student.bio || `View ${student.name}'s professional skills and projects.`,
  }
}

export default async function PortfolioPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const student = await getPortfolioData(slug)

  if (!student) notFound()

  // Fetch external stats in parallel
  const [githubStats, leetcodeStats, codeforcesStats] = await Promise.all([
    student.githubUsername ? fetchGitHubStats(student.githubUsername) : Promise.resolve(null),
    student.leetcodeUsername ? fetchLeetCodeStats(student.leetcodeUsername) : Promise.resolve(null),
    student.codeforcesUsername ? fetchCodeforcesStats(student.codeforcesUsername) : Promise.resolve(null),
  ])

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        {/* Header/Bio */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">{student.name}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {student.bio || "No bio added yet."}
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Badge variant="outline" className="px-4 py-1 text-sm">{student.primarySkill}</Badge>
          </div>
        </section>

        <div className="grid gap-12">
          {/* Platform Stats */}
          <PlatformStats 
            github={githubStats} 
            leetcode={leetcodeStats} 
            codeforces={codeforcesStats} 
          />

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((item: any) => (
                <Badge key={item.skill.name} variant="secondary" className="px-4 py-2 text-md gap-2">
                  {item.skill.name}
                  <span className="text-[10px] uppercase font-bold opacity-60">({item.proficiency})</span>
                </Badge>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Projects</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {student.projects.map((project: any) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} — {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">{project.description}</p>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                        View Live Project <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Certifications</h2>
            <div className="grid gap-4">
              {student.certifications.map((cert: any) => (
                <div key={cert.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</p>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Verify</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-24 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Powered by ECHFLUX — The Skills-First Career Ecosystem</p>
        </footer>
      </main>
    </div>
  )
}
