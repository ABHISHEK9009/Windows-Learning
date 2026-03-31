import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test connection
prisma.$connect()
  .then(() => {
    console.log('[Prisma] Database connection successful');
  })
  .catch((err) => {
    console.error('[Prisma] Database connection failed:', err);
  });

export default prisma;
