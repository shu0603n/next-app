import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export const getEmployments = () => {
  const data = prisma.employment.findMany();
  return data;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await getEmployments();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
