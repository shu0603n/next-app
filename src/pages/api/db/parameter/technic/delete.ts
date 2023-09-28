import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');
    console.log(`DELETE FROM technic WHERE id = ${Number(id)};`);
    await sql`DELETE FROM technic WHERE id = ${Number(id)};`;

    const data = await sql`SELECT * FROM technic;`;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
