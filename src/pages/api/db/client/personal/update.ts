import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
    const { id, name, name_k, phone, email, address, postal_code, remarks } = request.body;

    if (!id || !name) {
      throw new Error('パラメーターが不足しています');
    }

    const result = await sql`
      UPDATE client
      SET
        name = ${toNull(name)},
        name_k = ${toNull(name_k)},
        phone = ${toNull(phone)},
        email = ${toNull(email)},
        postal_code = ${toNull(postal_code)},
        address = ${toNull(address)},
        remarks = ${toNull(remarks)}
      WHERE
        id = ${Number(id)}
    `;

    if (result.rowCount === 0) {
      throw new Error('対象のIDが存在しませんでした');
    }
    if (result.rowCount !== 1) {
      throw new Error('複数のレコードが更新されてしまった可能性があります');
    }

    const data = await sql`
    SELECT 
        client.*
    FROM 
        client
    WHERE client.id = ${id};
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
