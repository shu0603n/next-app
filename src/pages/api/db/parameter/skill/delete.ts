import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');
    console.log(`DELETE FROM skill WHERE id = ${Number(id)};`);
    await sql`DELETE FROM skill WHERE id = ${Number(id)};`;

    const data = await sql`SELECT skill.*, technic.name AS technic_name 
    FROM skill 
    INNER JOIN technic ON skill.technic_id = technic.id;`;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
