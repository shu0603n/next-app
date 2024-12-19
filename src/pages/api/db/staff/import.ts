import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';
import pLimit from 'p-limit'; // 並列処理数を制限

export const maxDuration = 300;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // 必要なサイズを設定 (例: 10MB)
    }
  }
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'DELETE') {
    try {
      // スタッフデータをすべて削除
      await prisma.staff.deleteMany();
      response.status(200).json({ message: 'スタッフデータが正常に削除されました。' });
    } catch (error) {
      console.error('削除中にエラーが発生しました:', error);
      response.status(500).json({ error: 'データの削除中にエラーが発生しました。' });
    }
  } else if (request.method === 'POST') {
    const staffData = request.body; // 受け取ったスタッフデータの配列

    try {
      // スタッフデータの処理を待機
      await processStaffData(staffData);

      // 処理が完了した後にレスポンスを返す
      response.status(200).json({ message: 'スタッフデータの処理が完了しました' });
    } catch (error) {
      console.error('バックグラウンドで処理中にエラーが発生しました:', error);
      response.status(500).json({ error: 'データ処理中にエラーが発生しました' });
    }
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
    const formattedData = staffData
      .filter((staff) => staff.id) // id が存在しないデータを除外
      .map((staff) => {
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

    const batchSize = 100; // 一度に処理するデータのサイズ
    const limit = pLimit(5); // 並列処理数を制限（例: 同時に1つのバッチを処理）
    const promises = [];

    // バッチ処理を並列に実行
    for (let i = 0; i < formattedData.length; i += batchSize) {
      const batch = formattedData.slice(i, i + batchSize);

      // 各バッチを並列で処理
      const insertPromise = limit(() =>
        prisma.staff.createMany({
          data: batch
        })
      );

      promises.push(insertPromise);
    }
    console.log(promises);

    // すべての並列処理が完了するまで待つ
    await Promise.all(promises);

    console.log('スタッフデータ処理完了: すべてのデータがINSERTされました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error; // エラーが発生した場合は上位にエラーをスロー
  }
}
