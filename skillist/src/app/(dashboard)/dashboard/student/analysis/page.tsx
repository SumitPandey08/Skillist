import { auth } from '@clerk/nextjs/server'
import { db, eq, userScores, students, studentSkills, skills } from '@/db'
import { redirect } from 'next/navigation'
import { AnalysisClient } from './analysis-client'

export default async function AnalysisPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const studentScores = await db.query.userScores.findFirst({
    where: eq(userScores.studentId, userId),
  })

  const student = await db.query.students.findFirst({
    where: eq(students.id, userId),
  })

  const userSkillsData = await db
    .select({
      name: skills.name,
      proficiency: studentSkills.proficiency,
    })
    .from(studentSkills)
    .innerJoin(skills, eq(studentSkills.skillId, skills.id))
    .where(eq(studentSkills.studentId, userId))

  return <AnalysisClient scores={studentScores} student={student} skills={userSkillsData} />
}