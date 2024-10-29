import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const data = await sql`
      SELECT
          process.id,
          process.name
      FROM
          employee_project_processes
      INNER JOIN
        process
      ON
          employee_project_processes.employee_project_id = process.id
      WHERE
          employee_project_processes.employee_project_id = ${Number(id)}
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
