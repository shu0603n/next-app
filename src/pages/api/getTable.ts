import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const tableName = request.query.tableName as string;
    console.log(tableName);
    const data = await sql`SELECT * FROM Users;`;
    console.log(data);
    return response.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
}
