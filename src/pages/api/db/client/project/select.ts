import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const clientId = request.query.id as string;
    const data = await sql`

    SELECT 
        client.id,
        client.name,
        project.*
    FROM 
        client
    LEFT JOIN 
        project ON client.id = project.client_id
    WHERE 
        client.id = ${clientId}
    ORDER BY 
        project.start_date DESC;
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
