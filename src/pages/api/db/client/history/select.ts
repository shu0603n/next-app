import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export const selectClientHistory = async (clientId: string) => {
  const clientHistoryPromise = prisma.client_history.findMany({
    where: {
      client_id: Number(clientId)
    },
    select: {
      id: true,
      client_id: true,
      client_position: {
        select: {
          id: true,
          name: true
        }
      },
      employee: {
        select: {
          id: true,
          sei: true,
          mei: true
        }
      },
      time: true,
      name: true,
      gender: true,
      age: true,
      remarks: true
    }
  });

  return clientHistoryPromise;
};
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const clientId = request.query.id as string;

    const clientHistoryPromise = await selectClientHistory(clientId);

    const clientPositionPromise = prisma.client_position.findMany({
      select: {
        id: true,
        name: true
      }
    });

    // 同時に実行して待つ
    const [clientHistory] = await Promise.all([clientHistoryPromise]);
    const [clientPosition] = await Promise.all([clientPositionPromise]);

    return response.status(200).json({ clientHistory, clientPosition });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
