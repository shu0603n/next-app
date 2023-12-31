import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const data = await sql`
    SELECT 
    	employee_skills.*,
        client.name AS client_name,
		skills_used.id as skills_used_id
    FROM 
        employee_skills
    INNER JOIN 
        client ON employee_skills.client_id = client.id
    INNER JOIN 
        skills_used ON employee_skills.id = skills_used.id
    WHERE 
        employee_skills.employee_id = ${id};
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
