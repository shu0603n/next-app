import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';
import { selectMailList } from './select';

// mailList テーブルを更新する関数
export const updateMailList = async (id: number, title: string, main_text: string) => {
  const updatedMailList = await prisma.mail_list.update({
    where: { id },
    data: {
      title,
      main_text
    }
  });

  return updatedMailList;
};

// API ハンドラー
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    try {
      const { title, main_text, employee_id } = request.body;

      // リクエストボディに必要なデータが含まれていることを確認
      if (!title || !main_text) {
        return response.status(400).json({ error: '必要なデータが不足しています。' });
      }

      // mailListを更新
      await prisma.mail_list.create({
        data: {
          title,
          main_text,
          employee_id
        }
      });

      // 更新後のデータを取得
      const data = await selectMailList();

      // 更新後のデータを返す
      return response.status(200).json({ data });
    } catch (error) {
      console.error('エラーが発生しました:', error);
      return response.status(500).json({ error: 'データを更新できませんでした。' });
    }
  } else {
    return response.status(405).json({ error: '許可されていないメソッドです。' });
  }
}
