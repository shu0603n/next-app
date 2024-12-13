import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  // // デバッグモードを有効にする
  // log: ['query', 'error']
});
