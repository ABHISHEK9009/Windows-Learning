import { updateUserProfile } from './src/modules/users/user.service.js';
import prisma from './src/config/db.js';

async function test() {
  const mentor = await prisma.user.findFirst({ where: { role: 'MENTOR' }, select: { id: true, role: true } });
  
  if (mentor) {
    try {
      await updateUserProfile(mentor.id, {
        name: "Test Name",
        role: mentor.role,
        title: "Test Title",
        bio: "Test Bio",
        location: "Test Location",
        languages: "English",
        hourlyRate: 1500,
      });
      console.log('Success!');
    } catch (e) {
      console.error('Failed:', e);
    }
  } else {
    console.log('No mentor found');
  }
}

test().finally(() => prisma.$disconnect());
