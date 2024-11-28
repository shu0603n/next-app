import { NextApiResponse, NextApiRequest } from 'next';
import { getProjectPositions } from './select';
import { prisma } from '../../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const name = request.query.name as string;
    const description = request.query.description as string;

    if (!name || !description) throw new Error('パラメーターが不足しています');

    await prisma.project_position.create({
      data: {
        name,
        description
      }
    });

    const data = await getProjectPositions();

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
