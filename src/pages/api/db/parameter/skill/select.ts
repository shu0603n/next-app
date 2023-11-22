import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { getTechnics } from '../technic/select';

export const getSkills = () => {
  const data = prisma.skill.findMany({
    select: {
      id: true,
      name: true,
      technic: {
        select: {
          id: true,
          name: true
        }
      },
      candidate_flag: true
    }
  });
  return data;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await getSkills();
    const technic = await getTechnics();

    return response.status(200).json({ data, technic });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
