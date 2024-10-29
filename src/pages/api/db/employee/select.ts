import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await sql`
      SELECT 
          emp.id,
          emp.sei || ' ' || emp.mei AS name,
          emp.sei_k || ' ' || emp.mei_k AS name_k,
          emp.gender,
          emp.avatar,
          job_category.name AS job_category_name,
          employment.name AS employment_name,
          position.name AS position_name,
          CASE 
              WHEN emp.retirement_date <= CURRENT_DATE THEN 4
              WHEN TO_CHAR((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Tokyo'), 'HH24:MI:SS') BETWEEN '09:00:00' AND '18:00:00' THEN 1
              ELSE 2
          END AS status
      FROM employee AS emp
      LEFT JOIN job_category 
          ON emp.job_category_id = job_category.id
      LEFT JOIN employment
          ON emp.employment_id = employment.id
      LEFT JOIN position 
          ON emp.position_id = position.id;
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
