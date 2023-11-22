import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { getSkills } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { id, name, technic, candidate_flag } = request.body;

    if (!id || !name) throw new Error('パラメーターが不足しています');

    await prisma.skill.update({
      where: {
        id: Number(id)
      },
      data: {
        name: name as string,
        // technic_id: Number(technic?.id),
        technic: {
          connect: technic ? { id: technic.id } : undefined
        },
        candidate_flag: Boolean(candidate_flag)
      }
    });

    const data = await getSkills();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
