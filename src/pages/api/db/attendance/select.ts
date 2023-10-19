import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { employee_id, date } = request.body;
    const dateFormat = new Date(date);
    const year = dateFormat.getFullYear(); // 年を取得
    const month = dateFormat.getMonth() + 1; // 月を取得 (0から始まるので+1)

    // データを取得

    const data = await sql`
      SELECT 
        employee_id,
        TO_CHAR(date, 'YYYY/MM/DD') AS date,
        TO_CHAR(start_time, 'HH24:MI') AS start_time,
        TO_CHAR(end_time, 'HH24:MI') AS end_time,
        location
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
