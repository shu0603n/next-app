import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';

export const maxDuration = 300;

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
    // スタッフデータを整形
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

    // 一度にすべてのデータを挿入するのではなく、データをいくつかのバッチに分けて並列処理
    const batchSize = 100; // 一度に処理するデータのサイズ
    const promises = [];
    for (let i = 0; i < formattedData.length; i += batchSize) {
      const batch = formattedData.slice(i, i + batchSize);

      // 各バッチごとに挿入処理を並列で実行
      const insertPromise = prisma.staff.createMany({
        data: batch,
      });

      promises.push(insertPromise);
    }

    // すべての並列処理が完了するまで待つ
    await Promise.all(promises);

    console.log('スタッフデータ処理完了: すべてのデータがINSERTされました');
  } catch (error) {
    console.error('バックグラウンド処理中にエラーが発生しました:', error);
  }
}
