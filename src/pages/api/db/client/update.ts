// pages/api/your-api-route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';
import { getClients } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // リクエストボディをデストラクチャリング
    const { id, name, name_k, remarks, phone, email, postal_code, address } = request.body;
    console.log(request.body);

    if (!name) {
      throw new Error('パラメーターが不足しています');
    }

    // id が存在する場合は更新を行う
    if (id) {
      await prisma.client.update({
        where: { id: Number(id) },
        data: {
          name,
          name_k,
          remarks,
          phone,
          email,
          postal_code,
          address
        }
      });
    } else {
      // id が存在しない場合は新規挿入を行う
      await prisma.client.create({
        data: {
          name,
          name_k,
          remarks,
          phone,
          email,
          postal_code,
          address
        }
      });
    }

    // データを取得
    const data = await getClients();

    // レスポンスを送信
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
