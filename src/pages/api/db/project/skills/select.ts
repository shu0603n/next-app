import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const data = await sql`
      SELECT
          skill.id,
          skill.name,
          technic.name AS technic_name,
          skill.candidate_flag 
      FROM
          skills_used
      INNER JOIN
          skill
      ON
          skills_used.Skill_id = skill.id
      LEFT JOIN
          technic
      ON
          skill.Technic_id = technic.id
      WHERE
          skills_used.employee_project_id = ${Number(id)}
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
