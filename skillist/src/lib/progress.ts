export function calculateProfileCompleteness(data: {
  bio?: string | null
  skillsCount: number
  projectsCount: number
  certsCount: number
}): { score: number; missing: string[] } {
  let score = 0
  const missing: string[] = []

  // 1. Bio (20%)
  if (data.bio && data.bio.trim().length > 10) {
    score += 20
  } else {
    missing.push('Add a short bio (at least 10 characters)')
  }

  // 2. Skills (30%) - requires 3
  if (data.skillsCount >= 3) {
    score += 30
  } else if (data.skillsCount > 0) {
    score += 15 // Partial credit
    missing.push(`Add ${3 - data.skillsCount} more skills`)
  } else {
    missing.push('Add at least 3 skills')
  }

  // 3. Projects (30%) - requires 1
  if (data.projectsCount >= 1) {
    score += 30
  } else {
    missing.push('Add at least one project')
  }

  // 4. Certifications (20%) - requires 1
  if (data.certsCount >= 1) {
    score += 20
  } else {
    missing.push('Add at least one certification')
  }

  return { score, missing }
}
