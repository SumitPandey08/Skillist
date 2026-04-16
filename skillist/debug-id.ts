import { db, students, eq } from './src/db';

async function debugId() {
  const targetId = '3y_ktN_3xnogaNBjkQfahhooGMW2zQQU8BUp6G3L1tAj2imlqQIAiuOYCM3saZp9w';
  const student = await db.query.students.findFirst({
    where: eq(students.id, targetId),
  });

  if (student) {
    console.log('Found student with id:', JSON.stringify(student, null, 2));
  } else {
    console.log('No student found with id:', targetId);
  }
}

debugId().catch(console.error);
