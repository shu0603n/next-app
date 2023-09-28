import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const name = request.query.name as string;
    if (!name) throw new Error('パラメーターが不足しています');
    await sql`INSERT INTO working (Name) VALUES (${name});`;

    const data = await sql`SELECT * FROM working;`;
    console.log(data);
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
