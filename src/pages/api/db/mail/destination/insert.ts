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

      // staffDataの配列分、mail_destinationテーブルに新規レコードを作成
      await Promise.all(
        staffData.map(async (staff: any) => {
          await prisma.mail_destination.create({
            data: {
              staff_id: staff.id, // 新規レコードにstaff_idを設定
              mail_list_id: Number(id) // mail_list_idを設定
            }
          });
        })
      );

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
