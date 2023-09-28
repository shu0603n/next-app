import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const name = request.query.name as string;
    const technic_id = request.query.technic_id as string;
    if (!id || !name || !technic_id) throw new Error('パラメーターが不足しています');
    console.log(`UPDATE skill SET name = '${name}', technic_id = '${technic_id}' WHERE id = ${id};`);
    const result = await sql`UPDATE skill SET name = ${name.toString()}, technic_id = ${technic_id.toString()} WHERE id = ${Number(id)};`;
    console.log(result);
    if (result.rowCount === 0) {
      throw new Error('対象のIDが存在しませんでした');
    }
    if (result.rowCount !== 1) {
      throw new Error('複数のレコードが更新されてしまった可能性があります');
    }

    const data = await sql`SELECT skill.*, technic.name AS technic_name 
    FROM skill 
    INNER JOIN technic ON skill.technic_id = technic.id;`;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
