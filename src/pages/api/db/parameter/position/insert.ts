import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const name = request.query.name as string;
    if (!name) throw new Error('パラメーターが不足しています');
    await sql`INSERT INTO Position (Name) VALUES (${name});`;
  } catch (error) {
    return response.status(500).json({ error });
  }

  const data = await sql`SELECT * FROM Position;`;
  return response.status(200).json({ data });
}
