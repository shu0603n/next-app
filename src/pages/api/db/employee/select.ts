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
        Job_category.name AS job_category_name,
        Employment.name AS employment_name,
        position.name AS position_name
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
