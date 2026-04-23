import { auth } from '@clerk/nextjs/server'
import { fetchFromBackend } from '@/lib/api-server'
import { redirect } from 'next/navigation'
import { StudentDashboardLayout } from '@/components/dashboard/student/student-dashboard-layout'
import { SkillsSection } from '@/components/dashboard/skills-section'
import { ProjectsSection } from '@/components/dashboard/projects-section'
import { CertsSection } from '@/components/dashboard/certs-section'
import { GraduationCap, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function PortfolioPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let studentProfile = null
  let userSkills = []
  let userProjects = []
  let userCerts = []

  try {
    const data = await fetchFromBackend('/users/student/profile')
    studentProfile = data.student
    userSkills = studentProfile.skills.map((ss: any) => ({
      id: ss.skill.id,
      name: ss.skill.name,
      proficiency: ss.proficiency,
    }))
    userProjects = studentProfile.projects
    userCerts = studentProfile.certifications
  } catch (error) {
    console.error('Failed to fetch student profile:', error)
  }

  return (
    <StudentDashboardLayout maxWidth="max-w-[1600px]">
      <div className="space-y-12 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <GraduationCap className="w-3 h-3" /> Credentials Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Skill <span className="text-primary">Portfolio</span></h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Build your professional identity by showcasing your verified skills and accomplishments.
            </p>
          </div>
          
          <Link href={`/portfolio/${studentProfile?.slug}`} target="_blank">
             <Button variant="outline" className="rounded-full h-14 px-8 font-black gap-2 border-primary/20 hover:bg-primary hover:text-white transition-all duration-500 group shadow-xl shadow-primary/5">
                Public Portfolio <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </Button>
          </Link>
        </div>

        <div className="space-y-10">
          <div id="skills" className="p-10 rounded-[3rem] bg-background/60 backdrop-blur-xl border border-border/40 shadow-2xl shadow-primary/5">
            <SkillsSection initialSkills={userSkills} />
          </div>
          
          <div id="projects" className="p-10 rounded-[3rem] bg-background/60 backdrop-blur-xl border border-border/40 shadow-2xl shadow-primary/5">
            <ProjectsSection initialProjects={userProjects} />
          </div>
          
          <div id="certifications" className="p-10 rounded-[3rem] bg-background/60 backdrop-blur-xl border border-border/40 shadow-2xl shadow-primary/5">
            <CertsSection initialCerts={userCerts} />
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}
