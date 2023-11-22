import { NextApiResponse, NextApiRequest } from 'next';
import { getEmployments } from './select';
import { prisma } from '../../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');

    await prisma.employment.deleteMany({
      where: {
        id: Number(id)
      }
    });

    const data = await getEmployments();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
