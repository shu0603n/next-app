import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma'; // prisma インスタンスのインポート
import { selectStaff } from './select'; // selectStaff 関数をインポート

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const staffData = request.body; // 受け取ったスタッフデータの配列

    try {
      // すべてのスタッフの import_status_id を 0 に設定
      await prisma.staff.updateMany({
        data: {
          import_status_id: 0
        }
      });

      // 各スタッフデータに対して処理を行う
      for (const staff of staffData) {
        const { id, name, mail, birthday, staff_status_id } = staff;

        try {
          // 同一IDのスタッフが存在するか確認
          const existingStaff = await prisma.staff.findUnique({
            where: { id }
          });

          if (existingStaff) {
            // 既存スタッフがあればUPDATE
            await prisma.staff.update({
              where: { id },
              data: {
                name,
                mail,
                birthday: new Date(birthday), // PrismaのDate型に合わせる
                staff_status_id: parseInt(staff_status_id),
                import_status_id: 2 // UPDATEの場合は 2 を設定
              }
            });
          } else {
            // 存在しなければINSERT
            await prisma.staff.create({
              data: {
                id,
                name,
                mail,
                birthday: new Date(birthday), // PrismaのDate型に合わせる
                staff_status_id: parseInt(staff_status_id),
                import_status_id: 1 // INSERTの場合は 1 を設定
              }
            });
          }
        } catch (error) {
          console.error('エラーが発生しました:', error);

          // エラーが発生した場合には import_status_id を -1 に設定
          await prisma.staff.updateMany({
            where: { id },
            data: { import_status_id: -1 }
          });

          // 次のスタッフデータに進む
          continue;
        }
      }

      // 全てのINSERT/UPDATEが終わったら、selectStaffの結果を取得
      const data = await selectStaff();

      // 結果を返す
      return response.status(200).json({ data });
    } catch (error) {
      console.error('処理中にエラーが発生しました:', error);
      return response.status(500).json({ error: 'データ処理中にエラーが発生しました。' });
    }
  } else {
    response.status(405).json({ error: 'Method Not Allowed' });
  }
}
