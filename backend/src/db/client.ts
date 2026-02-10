import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Singleton Prisma client instance
let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    });

    // Handle graceful shutdown
    process.on('beforeExit', async () => {
      logger.info('Disconnecting Prisma client...');
      await prisma.$disconnect();
    });
  }

  return prisma;
}

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error });
    return false;
  }
}
