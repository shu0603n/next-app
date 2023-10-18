import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const employee_id = request.body.employee_id as string;
    const date = new Date(request.body.date);
    const year = date.getFullYear(); // 年を取得
    const month = date.getMonth() + 1; // 月を取得 (0から始まるので+1)

    const data = await sql`
      SELECT 
        *
      FROM 
        attendance
      WHERE 
        employee_id = ${Number(employee_id)}
        AND EXTRACT(YEAR FROM date) = ${year}
        AND EXTRACT(MONTH FROM date) = ${month};
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
