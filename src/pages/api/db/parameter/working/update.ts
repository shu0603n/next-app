import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const name = request.query.name as string;
    if (!id || !name) throw new Error('パラメーターが不足しています');
    console.log(`UPDATE working SET name = '${name}' WHERE id = ${id};`);
    const result = await sql`UPDATE working SET name = ${name.toString()} WHERE id = ${Number(id)};`;
    console.log(result);
    if (result.rowCount === 0) {
      throw new Error('対象のIDが存在しませんでした');
    }
    if (result.rowCount !== 1) {
      throw new Error('複数のレコードが更新されてしまった可能性があります');
    }

    const data = await sql`SELECT * FROM working;`;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
