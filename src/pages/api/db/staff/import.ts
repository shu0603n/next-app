import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';

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
// 有効な日付をチェックするユーティリティ関数
function isValidDate(date: string | Date): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

async function processStaffData(staffData: any[]) {
  try {
    // トランザクションを開始
    await prisma.$transaction(async (prisma) => {
      // すべてのデータを削除
      await prisma.staff.deleteMany();

      // 新しいデータを一括挿入
      const formattedData = staffData.map((staff) => {
        // 日付を変換し、無効な場合は `null` に設定
        const birthday = isValidDate(staff.birthday) ? new Date(staff.birthday) : null;

        return {
          id: staff.id,
          name: staff.name,
          mail: staff.mail,
          birthday, // 無効な日付なら `null` になる
          staff_status_id: parseInt(staff.staff_status_id),
          import_status_id: 1 // INSERTの場合は常に 1 を設定
        };
      });

      await prisma.staff.createMany({
        data: formattedData
      });
    });

    console.log('スタッフデータ処理完了: すべてのデータがINSERTされました');
  } catch (error) {
    console.error('バックグラウンド処理中にエラーが発生しました:', error);
  }
}
