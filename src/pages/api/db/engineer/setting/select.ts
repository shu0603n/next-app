import { PrismaClient } from '@prisma/client';
import { NextApiResponse, NextApiRequest } from 'next';

const prisma = new PrismaClient();

export const selectData = async (id: string) => {
  const roles = await prisma.roles.findFirst({
    where: {
      employee_id: Number(id) // 指定した employee_id
    }
  });
  if (roles) {
    const trueColumns = Object.entries(roles) // roles オブジェクトをエントリの配列に変換
      .filter(([key, value]) => value === true) // 値が true のエントリだけをフィルタリング
      .map(([key]) => key); // キー（カラム名）を抽出
    return trueColumns;
  } else {
    return [];
  }
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;

    // Prismaを使ってデータを取得
    const data = await selectData(id);

    // データが見つからない場合は404エラーを返す
    if (!data) {
      return response.status(404).json({ error: '権限が見つかりません' });
    }

    // データが見つかった場合は成功レスポンスを返す
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
