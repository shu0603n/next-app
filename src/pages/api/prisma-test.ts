import { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  const employee = await prisma.user.findMany()
  console.log(employee)
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    await main();
    await prisma.$disconnect();
    response.status(200).json({ message: 'データを取得しました。' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
