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

    // 同時に実行して待つ
    const [client] = await Promise.all([clientPromise]);
    const [employee] = await Promise.all([employeePromise]);

    return response.status(200).json({ data, client, employee });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
