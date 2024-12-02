import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const clientId = request.query.id as string;

    const clientPromise = prisma.client.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const employeePromise = prisma.employee.findMany({
      select: {
        id: true,
        sei: true
      }
    });

    const contractPromise = prisma.contract.findMany({
      select: {
        id: true,
        name: true
      }
    });

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
      client.id,
      client.name AS client_name,
      project.*,
      employee.sei,
      contract.name AS contract_name,
      array_agg(DISTINCT skill.name) AS skills,
      array_agg(DISTINCT process.name) AS processes
    FROM 
      client
    LEFT JOIN 
      project ON client.id = project.client_id
    LEFT JOIN 
      employee ON project.employee_id = employee.id
    LEFT JOIN 
      contract ON project.contract_id = contract.id
    LEFT JOIN 
      project_skills ON project.id = project_skills.project_id
    LEFT JOIN 
      skill ON project_skills.skill_id = skill.id
    LEFT JOIN 
      project_process ON project.id = project_process.project_id
    LEFT JOIN 
      process ON project_process.process_id = process.id
    WHERE 
      client.id = ${clientId}
    GROUP BY
      client.id, project.id, employee.id, contract.id
    ORDER BY 
      project.start_date DESC;
    `;

    // 同時に実行して待つ
    const [client] = await Promise.all([clientPromise]);
    const [employee] = await Promise.all([employeePromise]);
    const [contract] = await Promise.all([contractPromise]);
    const [skill] = await Promise.all([skillPromise]);
    const [process] = await Promise.all([processPromise]);

    return response.status(200).json({ data, client, employee, contract, skill, process });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
