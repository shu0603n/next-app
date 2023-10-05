import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const data = await sql`
    SELECT 
        emp.*,
        Employment.name AS Employment_name,
        Position.name AS Position_name
    FROM 
        employee AS emp
    INNER JOIN 
        Employment ON emp.Employment_id = Employment.id
    INNER JOIN 
        Position ON emp.Position_id = Position.id
    WHERE emp.id = ${id};
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
