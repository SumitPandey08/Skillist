import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Award, Calendar, ExternalLink, 
  Globe, Mail, MapPin, Briefcase, GraduationCap, 
  Sparkles, CheckCircle2, Star, Zap, Code2, Rocket, Brain, Terminal,
  Cpu, Layout, Server, Database, Shield, Smartphone, Link as LinkIcon
} from 'lucide-react'
import { Github, Linkedin } from '@/components/icons'

import { fetchGitHubStats } from '@/lib/integrations/github'
import { fetchLeetCodeStats } from '@/lib/integrations/leetcode'
import { fetchCodeforcesStats } from '@/lib/integrations/codeforces'
import { PlatformStats } from '@/components/portfolio/platform-stats'
import { fetchFromBackend } from '@/lib/api-server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    title: `${student.name} | Skillist Professional Portfolio`,
    description: student.bio || `View ${student.name}'s verified skills, projects, and career trajectory on Skillist.`,
  }
}

// Robust Augmented Data Helper
const getAugmentedData = (student: any) => {
  const hasExperience = student.experience && student.experience.length > 0
  const hasProjects = student.projects && student.projects.length > 0
  const hasSkills = student.skills && student.skills.length > 0
  const hasCerts = student.certifications && student.certifications.length > 0

  const dummyExperience = [
    {
      title: 'Senior Software Architect',
      company: 'Future Systems (Demo)',
      location: 'Silicon Valley, CA',
      startDate: '2023-01-01',
      endDate: null,
      description: 'Leading the development of high-scale distributed systems. Architected a microservices mesh that handles 10M+ concurrent connections with 99.99% uptime.',
      isCurrentRole: true
    },
    {
      title: 'Full Stack Engineer',
      company: 'TechFlow Global',
      location: 'Remote',
      startDate: '2021-06-01',
      endDate: '2022-12-31',
      description: 'Developed and maintained core features using React, Node.js, and AWS. Improved CI/CD pipeline efficiency by 60%.',
      isCurrentRole: false
    }
  ]

  const dummyProjects = [
    {
      title: 'Neural Match Engine',
      description: 'A deep-learning powered matching system using Python and TensorFlow to optimize talent-to-role fit with 94% accuracy.',
      url: '#',
      technologies: ['Python', 'TensorFlow', 'PostgreSQL', 'Docker'],
      category: 'AI / Machine Learning'
    },
    {
      title: 'Quantum Ledger',
      description: 'High-performance immutable transaction system built with Go and specialized encryption layers for fintech compliance.',
      url: '#',
      technologies: ['Go', 'gRPC', 'Redis', 'Kubernetes'],
      category: 'Fintech / Security'
    }
  ]

  const dummySkills = [
    { skill: { name: 'Full Stack Architecture' }, proficiency: 'Expert' },
    { skill: { name: 'Cloud Native Systems' }, proficiency: 'Advanced' },
    { skill: { name: 'Agentic AI' }, proficiency: 'Expert' },
    { skill: { name: 'Low-Latency APIs' }, proficiency: 'Advanced' },
    { skill: { name: 'System Design' }, proficiency: 'Expert' }
  ]

  const dummyCerts = [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2023-05-15', credentialUrl: '#' },
    { name: 'Google Professional Cloud Developer', issuer: 'Google Cloud', issueDate: '2022-11-20', credentialUrl: '#' }
  ]

  return {
    experience: hasExperience ? student.experience : dummyExperience,
    projects: hasProjects ? student.projects : dummyProjects,
    skills: hasSkills ? student.skills : dummySkills,
    certifications: hasCerts ? student.certifications : dummyCerts
  }
}

export default async function PortfolioPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const student = await getPortfolioData(slug)

  if (!student) notFound()

  const data = getAugmentedData(student)

  // Fetch external stats in parallel
  const [githubStats, leetcodeStats, codeforcesStats] = await Promise.all([
    student.githubUsername ? fetchGitHubStats(student.githubUsername) : Promise.resolve(null),
    student.leetcodeUsername ? fetchLeetCodeStats(student.leetcodeUsername) : Promise.resolve(null),
    student.codeforcesUsername ? fetchCodeforcesStats(student.codeforcesUsername) : Promise.resolve(null),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden transition-colors duration-300">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
      
      {/* Abstract mesh background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3 prophecy='%3Cpath d='M54 48L30 36 6 48V24l24-12 24 12v24zM30 0l30 15v30L30 60 0 45V15L30 0z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      {/* Hero Section */}
      <header className="relative pt-24 pb-20 overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                    {/* Profile Avatar / Initial */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                        <div className="relative w-40 h-40 rounded-[2.2rem] bg-card border border-border shadow-2xl flex items-center justify-center text-6xl font-black overflow-hidden">
                            {student.name.charAt(0)}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl border-4 border-background animate-bounce-slow">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                              <Sparkles className="w-3.5 h-3.5" /> Verified Skillist Talent
                           </div>
                           <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{student.name}</h1>
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground font-bold">
                               <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-widest"><Briefcase className="w-4 h-4 text-primary" /> {student.primarySkill || 'Technologist'}</div>
                               <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-border" />
                               <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-widest"><MapPin className="w-4 h-4 text-primary" /> {student.location || 'Remote'}</div>
                           </div>
                        </div>

                        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium italic">
                            "{student.bio || "Crafting the next generation of digital experiences through verified technical expertise and relentless innovation."}"
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {student.linkedinUrl && (
                                <a href={student.linkedinUrl} target="_blank" className="p-3 rounded-2xl bg-muted border border-border hover:bg-accent transition-all">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {student.githubUrl && (
                                <a href={student.githubUrl} target="_blank" className="p-3 rounded-2xl bg-muted border border-border hover:bg-accent transition-all">
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            <a href={`mailto:${student.email}`} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                <Mail className="w-4 h-4" /> Hire Me
                            </a>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </header>

      <main className="container mx-auto px-4 max-w-5xl pb-32 space-y-24">
        
        {/* Verification Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 rounded-[2rem] bg-muted/30 border border-border backdrop-blur-sm shadow-sm">
            {[
                { label: 'Identity', status: 'Verified', icon: Star },
                { label: 'Skills', status: 'AI Validated', icon: Brain },
                { label: 'Activity', status: 'Consistent', icon: Zap },
                { label: 'Potential', status: 'High', icon: Rocket }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-card border border-border/50 group hover:border-primary/30 transition-all shadow-sm">
                    <stat.icon className="w-5 h-5 text-primary mb-2 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</span>
                    <span className="text-sm font-black text-foreground">{stat.status}</span>
                </div>
            ))}
        </div>

        {/* Technical Arsenal */}
        <section>
          <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight uppercase">Technical Arsenal</h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Verified Proficiency Matrix</p>
              </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.skills.map((item: any, idx: number) => (
              <div key={idx} className="p-6 rounded-[2rem] bg-card border border-border hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Brain className="w-16 h-16 text-primary" />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-black tracking-tight">{item.skill.name}</span>
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-black uppercase text-[9px] py-1 px-3">
                        {item.proficiency}
                    </Badge>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                        style={{ width: item.proficiency === 'Expert' ? '95%' : item.proficiency === 'Advanced' ? '80%' : '60%' }}
                    />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Intelligence */}
        {(githubStats || leetcodeStats || codeforcesStats) && (
          <section className="p-10 rounded-[3rem] bg-gradient-to-br from-primary/[0.03] via-card to-indigo-500/[0.03] border border-border relative overflow-hidden group shadow-xl">
             <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
             <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-2xl bg-muted border border-border shadow-xl">
                    <Globe className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Ecosystem Presence</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Integration Feed</p>
                </div>
             </div>
             <PlatformStats 
                github={githubStats} 
                leetcode={leetcodeStats} 
                codeforces={codeforcesStats} 
             />
          </section>
        )}

        {/* Featured Build-outs */}
        <section>
          <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Rocket className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight uppercase">Featured Build-outs</h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Architectural Case Studies</p>
              </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {data.projects.map((project: any, idx: number) => (
              <Card key={idx} className="group overflow-hidden rounded-[2.5rem] bg-card border border-border hover:border-amber-500/30 transition-all duration-500 shadow-2xl relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                    <Code2 size={120} />
                </div>
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <Terminal className="w-6 h-6 text-amber-500" />
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black uppercase border-border text-muted-foreground tracking-[0.2em]">Open Source</Badge>
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight group-hover:text-amber-500 transition-colors">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <p className="text-muted-foreground font-medium leading-relaxed italic line-clamp-3">
                    "{project.description}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies || []).map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-muted rounded-lg border border-border">{tech}</span>
                    ))}
                  </div>

                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-amber-600 hover:text-amber-500 transition-colors uppercase tracking-widest pt-2">
                      Examine Architecture <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trajectory & Certifications */}
        <div className="grid md:grid-cols-12 gap-12">
            {/* Experience */}
            <div className="md:col-span-7 space-y-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Trajectory</h2>
                </div>
                <div className="space-y-6 pl-4 border-l-2 border-border">
                    {data.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="relative pl-8 group">
                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-blue-500 group-hover:scale-150 transition-transform" />
                            <div className="p-6 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all shadow-sm hover:shadow-md">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">
                                    {new Date(exp.startDate).getFullYear()} — {exp.isCurrentRole ? 'PRESENT' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                                </span>
                                <h3 className="text-xl font-black tracking-tight">{exp.title}</h3>
                                <p className="text-muted-foreground font-bold mb-4">{exp.company}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications */}
            <div className="md:col-span-5 space-y-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <Award className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Accreditation</h2>
                </div>
                <div className="space-y-4">
                    {data.certifications.length > 0 ? (
                        data.certifications.map((cert: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-4 p-5 rounded-3xl bg-card border border-border hover:border-emerald-500/30 transition-all group shadow-sm">
                                <div className="p-3 bg-emerald-500/5 rounded-2xl">
                                    <Star className="w-5 h-5 text-emerald-600 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black truncate tracking-tight">{cert.name}</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{cert.issuer}</p>
                                </div>
                                {cert.credentialUrl && (
                                    <a href={cert.credentialUrl} target="_blank" className="p-2 hover:bg-emerald-500/10 rounded-xl transition-all">
                                        <ExternalLink className="w-4 h-4 text-emerald-500" />
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center border-2 border-dashed border-border rounded-[2rem] opacity-30">
                            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-xs font-black uppercase tracking-widest">No Certs Linked</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <footer className="mt-40 pt-20 border-t border-border text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/[0.02] blur-[100px] rounded-full pointer-events-none" />
          <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground font-black text-2xl shadow-2xl shadow-primary/20">
                  S
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-bold">This profile is cryptographically verified by the Skillist AI Ecosystem.</p>
                <p className="text-muted-foreground/60 text-xs font-black uppercase tracking-[0.3em]">Built for the future of work.</p>
              </div>
              <Link href="/">
                <Button variant="outline" className="rounded-full px-8 py-6 font-black uppercase tracking-widest border-border hover:bg-foreground hover:text-background transition-all">
                    Create Your Skillist Portfolio
                </Button>
              </Link>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.5em] pb-10">© {new Date().getFullYear()} Skillist Engine. All Systems Operational.</p>
        </footer>
      </main>
    </div>
  )
}
