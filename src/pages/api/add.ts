import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // const petName = request.query.petName as string;
    // const ownerName = request.query.ownerName as string;
    // if (!petName || !ownerName) throw new Error('Pet and owner names required');
    // await sql`INSERT INTO Users (Name, Owner) VALUES (${petName}, ${ownerName});`;
    await sql`INSERT INTO Users (Email , Password) VALUES ('test6',' test6');`;
    // await sql`INSERT INTO Users (Email , Password) VALUES ('test7',' test7');`;
    // await sql`INSERT INTO Users (Email , Password) VALUES ('test8',' test8');`;
    // await sql`INSERT INTO Users (Email , Password) VALUES ('test9',' test9');`;
    // await sql`INSERT INTO Users (Name, Owner) VALUES (${petName}, ${ownerName});`;
    // await sql`INSERT INTO Users (Name, Owner) VALUES (${petName}, ${ownerName});`;
  } catch (error) {
    return response.status(500).json({ error });
  }

  const data = await sql`SELECT * FROM Users;`;
  return response.status(200).json({ data });
}
