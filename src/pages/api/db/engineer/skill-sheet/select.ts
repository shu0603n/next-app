import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const data = await sql`
    SELECT
        s.name
    FROM
        public.employee_project ep
    JOIN
        employee_project_skills eps ON ep.id = eps.employee_project_id
    JOIN
        skill s ON eps.skill_id = s.id
    WHERE
        ep.id = ${id};
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
