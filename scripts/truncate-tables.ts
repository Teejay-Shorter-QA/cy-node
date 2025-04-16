import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

// sqlite script to delete all rows in the tables to allow it to start fresh

export async function truncateTables(): Promise<void> {
  await prisma.$executeRaw`DELETE FROM 'Movie'`;
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Movie'`;
  console.log('Tables truncated');
  await prisma.$disconnect();
}
