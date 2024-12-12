import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { selectIsComplete } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    try {
      const id = request.query.id as string; // mail_list_id
      const staffData = request.body; // 受け取ったスタッフデータの配列

      // mail_destinationテーブルから、指定されたmail_list_idのデータを削除
      await prisma.mail_destination.deleteMany({
        where: {
          mail_list_id: Number(id)
        }
      });

      // 新しいスタッフデータを一括で追加
      const staffRecords = staffData.map((staff: any) => ({
        staff_id: staff.id,
        mail_list_id: Number(id),
      }));

      if (staffRecords.length > 0) {
        await prisma.mail_destination.createMany({
          data: staffRecords
        });
      }

      // 件数が 0 なら true、それ以外なら false を返す
      const isComplete = await selectIsComplete(id);

      // 結果を返す
      return response.status(200).json({ isComplete });
    } catch (error) {
      console.error('処理中にエラーが発生しました:', error);
      return response.status(500).json({ error: 'データ処理中にエラーが発生しました。' });
    }
  } else {
    response.status(405).json({ error: 'Method Not Allowed' });
  }
}
