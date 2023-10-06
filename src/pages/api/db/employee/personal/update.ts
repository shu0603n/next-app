import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const {
      id,
      sei,
      mei,
      sei_k,
      mei_k,
      gender,
      birthday,
      remarks,
      phone_number,
      email,
      postal_code,
      address,
      joining_date,
      retirement_date,
      employment_id,
      position_id
    } = request.body;

    if (!id || !sei || !mei) {
      throw new Error('パラメーターが不足しています');
    }

    const result = await sql`
      UPDATE employee
      SET
        sei = ${sei},
        mei = ${mei},
        sei_k = ${sei_k},
        mei_k = ${mei_k},
        gender = ${gender},
        birthday = ${birthday},
        remarks = ${remarks},
        phone_number = ${phone_number},
        email = ${email},
        postal_code = ${postal_code},
        address = ${address},
        joining_date = ${joining_date},
        retirement_date = ${retirement_date},
        employment_id = ${Number(employment_id)},
        position_id = ${Number(position_id)}
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
        emp.*,
        Employment.name AS Employment_name,
        Position.name AS Position_name
    FROM 
        employee AS emp
    LEFT JOIN 
        Employment ON emp.Employment_id = Employment.id
    LEFT JOIN 
        Position ON emp.Position_id = Position.id
    WHERE emp.id = ${id};
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
