import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma';

export default async function deleteProject(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');

    // clientと関連するデータを削除
    const deleteClient = await prisma.client.deleteMany({
      where: {
        id: Number(id)
      }
    });

    // 削除された件数をチェック
    if (deleteClient.count === 0) {
      return response.status(404).json({ error: '削除対象が見つかりませんでした。' });
    }

    const getClients = () => prisma.client.findMany();
    const data = await getClients();

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
