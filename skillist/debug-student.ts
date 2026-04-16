import { db, students, eq } from './src/db';

async function debugStudent() {
  const userId = 'user_3CGJcczyuNyYOiV2vV9XQIBSNeM';
  const student = await db.query.students.findFirst({
    where: eq(students.id, userId),
  });

  console.log('Student record:', JSON.stringify(student, null, 2));
}

debugStudent().catch(console.error);
