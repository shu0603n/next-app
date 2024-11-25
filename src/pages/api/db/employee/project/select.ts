import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const employeeId = request.query.id as string;

    const skillPromise = prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        candidate_flag: true
      }
    });

    const processPromise = prisma.process.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const data = await sql`
    SELECT 
        employee_project.*,
        client.name AS client_name,
	    pp.name AS project_position_name,
        array_agg(DISTINCT s.name) AS skills,
        array_agg(DISTINCT p.name) AS process
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
    LEFT JOIN
	    project_position pp ON employee_project.project_position_id = pp.id
    WHERE 
        employee_project.employee_id = ${employeeId} 
    GROUP BY 
        employee_project.id, client.name, pp.name;
    `;

    // 同時に実行して待つ
    const [skill] = await Promise.all([skillPromise]);
    const [process] = await Promise.all([processPromise]);

    // データをコンソールに出力して確認
    console.log('取得したデータ:', data, skill, process);

    return response.status(200).json({ data, skill, process });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
