import { describe, it, expect } from 'vitest'
import { generateStudentSlug } from '../lib/slugs'

describe('Slug Logic', () => {
  it('should generate a valid slug from a name', () => {
    const slug = generateStudentSlug('Sumit Kumar')
    expect(slug).toMatch(/^sumit-kumar-[a-z0-9]{6}$/)
  })

  it('should handle special characters and spaces', () => {
    const slug = generateStudentSlug('  John-Doe & Co.  ')
    expect(slug).toMatch(/^john-doe-and-co-[a-z0-9]{6}$/)
  })
})
