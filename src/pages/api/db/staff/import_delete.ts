import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      // スタッフデータをすべて削除
      await prisma.staff.deleteMany();
      res.status(200).json({ message: 'スタッフデータが正常に削除されました。' });
    } catch (error) {
      console.error('削除中にエラーが発生しました:', error);
      res.status(500).json({ error: 'データの削除中にエラーが発生しました。' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' }); // DELETEメソッド以外の場合
  }
}
