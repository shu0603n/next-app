import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';

// mailList テーブルからデータを取得する関数
export const selectMailList = async () => {
  const data = await prisma.mail_list.findMany({
    select: {
      id: true,
      title: true,
      main_text: true,
      employee: {
        select: {
          id: true,
          sei: true,
          mei: true
        }
      }
    }
  });

  return data;
};

// API ハンドラー
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await selectMailList();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
