import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';
import { selectStaff } from './select';
import pLimit from 'p-limit';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const staffData = request.body; // 受け取ったスタッフデータの配列

    // 即座にレスポンスを返す
    response.status(200).json({ message: '処理がバックグラウンドで開始されました' });

    // 長時間かかる処理をバックグラウンドで実行
    processStaffData(staffData).catch((error) => {
      console.error('バックグラウンドで処理中にエラーが発生しました:', error);
    });
  } else {
    response.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function processStaffData(staffData: any[]) {
  const limit = pLimit(10); // ここで並列実行数を制限（例えば10）

  try {
    // 配列を逆順にする
    const reversedStaffData = staffData.reverse();

    // すべてのスタッフの import_status_id を 0 に設定
    await prisma.staff.updateMany({
      data: {
        import_status_id: 0
      }
    });

    // 各スタッフデータに対する処理を並列で実行（並列数制限あり）
    const staffPromises = reversedStaffData.map((staff) => {
      return limit(async () => {
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
                import_status_id: 2, // UPDATEの場合は 2 を設定
                updated_at: new Date() // 現在の日時を updated_at に設定
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
          return;
        }
      });
    });

    // すべての処理が完了するのを待つ
    await Promise.all(staffPromises);

    // 全てのINSERT/UPDATEが終わったら、selectStaffの結果を取得
    const data = await selectStaff();
    console.log('スタッフデータ処理完了:', data);
  } catch (error) {
    console.error('バックグラウンド処理中にエラーが発生しました:', error);
  }
}
