import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export const getContracts = () => {
  const data = prisma.contract.findMany();
  return data;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await getContracts();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
