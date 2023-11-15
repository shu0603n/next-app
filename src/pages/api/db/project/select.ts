import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await sql`
      SELECT
        project.id,
        project.hp_posting_flag,
        client.name AS client_Name,
        contract.name AS contract_Name,
        project.working_postal_code,
        project.working_address,
        project.working_start_time,
        project.working_end_time,
        project.holiday,
        project.project_title,
        project.description
    FROM project
    LEFT JOIN client ON project.client_id = client.id
    LEFT JOIN contract ON project.contract_id = contract.id;
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
