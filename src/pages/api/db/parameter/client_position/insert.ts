import { NextApiResponse, NextApiRequest } from 'next';
import { getMailAccounts } from './select';
import { prisma } from '../../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const name = request.query.name as string;

    if (!name) throw new Error('パラメーターが不足しています');

    await prisma.client_position.create({
      data: {
        name
      }
    });

    const data = await getMailAccounts();

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
