import { db, students, eq } from './src/db';

async function debugSlug() {
  const targetSlug = '3y_ktN_3xnogaNBjkQfahhooGMW2zQQU8BUp6G3L1tAj2imlqQIAiuOYCM3saZp9w';
  const student = await db.query.students.findFirst({
    where: eq(students.slug, targetSlug),
  });

  if (student) {
    console.log('Found student with slug:', JSON.stringify(student, null, 2));
  } else {
    console.log('No student found with slug:', targetSlug);
  }
}

debugSlug().catch(console.error);
