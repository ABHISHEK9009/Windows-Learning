import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'abhishekverma9920@gmail.com';
  const password = 'admin@windows-learning_09092002';
  const role = 'ADMIN';
  const name = 'Admin User';

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: role,
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: role,
      notificationSetting: { create: {} },
      wallet: { create: {} },
    },
  });

  console.log(`Admin account ${admin.email} has been set up successfully with role ${admin.role}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
