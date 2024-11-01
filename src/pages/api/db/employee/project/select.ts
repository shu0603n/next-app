import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const employeeId = request.query.id as string;

    const data = await sql`
    SELECT 
        employee_project.*,
        client.name AS client_name,
        array_agg(s.name) AS skills,
        array_agg(p.name) AS process
    FROM 
        employee_project
    LEFT JOIN 
        client ON employee_project.client_id = client.id
    LEFT JOIN 
        employee_project_skills eps ON employee_project.id = eps.employee_project_id
    LEFT JOIN 
        skill s ON eps.skill_id = s.id
    LEFT JOIN
        employee_project_processes epp ON employee_project.id = epp.employee_project_id
    LEFT JOIN
        process p ON epp.process_id = p.id
    WHERE 
        employee_project.employee_id = ${employeeId} 
    GROUP BY 
        employee_project.id, client.name;
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
