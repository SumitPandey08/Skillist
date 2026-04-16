import slugify from 'slugify'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6)

export function generateStudentSlug(name: string): string {
  const base = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  })
  
  return `${base}-${nanoid()}`
}
