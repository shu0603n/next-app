import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const data = await sql`
    SELECT 
    	invoice.*,
        client.name AS client_name,
        employee.sei || employee.mei AS employee_name,
        project.project_title AS project_name
    FROM 
        invoice
    INNER JOIN 
        client ON invoice.client_id = client.id
    INNER JOIN 
        employee ON invoice.employee_id = employee.id
    INNER JOIN 
        project ON invoice.project_id = project.id
    WHERE 
        invoice.employee_id = ${id};
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
