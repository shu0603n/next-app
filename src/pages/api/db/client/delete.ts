import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma';
import { getClients } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id;
    if (!id) throw new Error('パラメーターが不足しています');

    // Prismaを使用してデータを削除
    await prisma.client.deleteMany({
      where: {
        id: Number(id)
      }
    });

    // データを再取得
    const data = await getClients();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    // モジュールの終了時に PrismaClient を切断
    await prisma.$disconnect();
  }
}
