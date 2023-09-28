import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');
    console.log(`DELETE FROM Position WHERE id = ${Number(id)};`);
    await sql`DELETE FROM Position WHERE id = ${Number(id)};`;

    const { rows } = await sql`SELECT * FROM Position;`;
    return response.status(200).json({ rows });
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
}
