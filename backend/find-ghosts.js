import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function hunt() {
  const users = await prisma.user.findMany();
  console.log("ALL USERS:", users.map(u => ({id: u.id, name: u.name, email: u.email})));
  
  const mentors = await prisma.mentorProfile.findMany({
    include: { user: true }
  });
  console.log("ALL MENTORS:", mentors.map(m => ({id: m.id, userId: m.userId, name: m.user?.name, bio: m.bio})));
}

hunt().finally(() => prisma.$disconnect());
