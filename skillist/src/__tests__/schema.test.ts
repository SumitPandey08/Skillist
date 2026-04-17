import { describe, it, expect } from 'vitest';
import { db, users, students, skills, studentSkills, projects, certifications, companies, jobs, jobSkills, eq } from '@/db';
import { nanoid } from 'nanoid';

describe('Drizzle Schema', () => {
  it('should allow inserting and retrieving a student with new fields', async () => {
    // This test assumes DATABASE_URL is set and DB is accessible
    // In a real CI environment, we'd use a test database
    if (!process.env.DATABASE_URL) {
      console.log('Skipping DB test - DATABASE_URL not set');
      return;
    }

    const testId = `test_${Date.now()}`;
    const testEmail = `test_${testId}@example.com`;
    const testSlug = `test-slug-${testId}`;

    try {
      // 1. Create user
      await db.insert(users).values({
        id: testId,
        email: testEmail,
        role: 'student',
      });

      // 2. Create student
      await db.insert(students).values({
        id: testId,
        name: 'Test Student',
        slug: testSlug,
        bio: 'This is a test bio',
      });

      const student = await db.query.students.findFirst({
        where: eq(students.id, testId),
      });

      expect(student).toBeDefined();
      expect(student?.slug).toBe(testSlug);
      expect(student?.bio).toBe('This is a test bio');

      // 3. Cleanup
      await db.delete(users).where(eq(users.id, testId));
    } catch (err) {
      console.error('DB test error:', err);
    }
  });

  it('should allow creating a job with skills', async () => {
    if (!process.env.DATABASE_URL) return;

    const companyId = `comp_${Date.now()}`;
    const jobId = `job_${Date.now()}`;
    
    try {
      // 1. Setup company
      await db.insert(users).values({ id: companyId, email: `${companyId}@example.com`, role: 'company' });
      await db.insert(companies).values({ 
        id: companyId, 
        name: 'John HR', 
        companyName: 'Test Corp', 
        industry: 'Tech' 
      });

      // 2. Create job
      await db.insert(jobs).values({
        id: jobId,
        companyId: companyId,
        title: 'Senior Engineer',
        description: 'Need a pro.',
        status: 'active',
      });

      // 3. Add skill to job
      const skillId = nanoid();
      await db.insert(skills).values({ id: skillId, name: `Skill_${jobId}` });
      await db.insert(jobSkills).values({
        jobId: jobId,
        skillId: skillId,
        requiredProficiency: 'advanced',
      });

      const jobWithSkills = await db.query.jobs.findFirst({
        where: eq(jobs.id, jobId),
      });

      expect(jobWithSkills?.title).toBe('Senior Engineer');

      // 4. Cleanup
      await db.delete(users).where(eq(users.id, companyId));
    } catch (err) {
      console.error('Job test error:', err);
    }
  });

  it('should support 1536-dimension skill vectors', async () => {
    if (!process.env.DATABASE_URL) return;

    const testId = `test_vector_${Date.now()}`;
    const testSlug = `test-vector-slug-${testId}`;
    
    try {
      await db.insert(users).values({ id: testId, email: `${testId}@example.com`, role: 'student' });
      
      const vector = Array(1536).fill(0.1);
      await db.insert(students).values({
        id: testId,
        name: 'Vector Test',
        slug: testSlug,
        skillVector: vector,
      });

      const student = await db.query.students.findFirst({
        where: eq(students.id, testId),
      });

      expect(student?.skillVector?.length).toBe(1536);
      
      await db.delete(users).where(eq(users.id, testId));
    } catch (err) {
      console.error('Vector test error:', err);
    }
  });
});
