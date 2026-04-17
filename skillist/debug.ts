import { db } from './src/db/index';
import { users } from './src/db/schema';

async function test() {
  try {
    const result = await db.insert(users).values({
      id: 'test_id_123',
      email: 'test_insert@example.com',
      role: 'student'
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        role: 'student',
        updatedAt: new Date()
      }
    });
    console.log('Insert Users Result:', result);
    
    const userRows = await db.select().from(users).where((u) => u.id === 'test_id_123');
    console.log('Refetched User:', userRows);

  } catch (err) {
    console.error('Error inserting user:', err);
  }
}

test();
