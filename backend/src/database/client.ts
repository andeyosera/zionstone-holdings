import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';

// This pattern prevents creating multiple Prisma instances
// during hot-reload in development. In production there's
// always exactly one instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.nodeEnv === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (config.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}