import { auth } from '@clerk/nextjs/server'
import { db, eq, students, studentSkills, skills, projects, certifications } from '@/db'
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

  const studentProfile = await db.query.students.findFirst({
    where: eq(students.id, userId),
  })

  const userSkills = await db
    .select({
      id: skills.id,
      name: skills.name,
      proficiency: studentSkills.proficiency,
    })
    .from(studentSkills)
    .innerJoin(skills, eq(studentSkills.skillId, skills.id))
    .where(eq(studentSkills.studentId, userId))

  const userProjects = await db.query.projects.findMany({
    where: eq(projects.studentId, userId),
    orderBy: (projects: any, { desc }: any) => [desc(projects.startDate)],
  })

  const userCerts = await db.query.certifications.findMany({
    where: eq(certifications.studentId, userId),
    orderBy: (certifications: any, { desc }: any) => [desc(certifications.issueDate)],
  })

  return (
    <StudentDashboardLayout>
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
