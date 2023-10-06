import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
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
      position_id,
      job_category_id
    } = request.body;

    if (!id || !sei || !mei) {
      throw new Error('パラメーターが不足しています');
    }

    const result = await sql`
      UPDATE employee
      SET
        sei = ${toNull(sei)},
        mei = ${toNull(mei)},
        sei_k = ${toNull(sei_k)},
        mei_k = ${toNull(mei_k)},
        gender = ${toNull(gender)},
        birthday = ${toNull(birthday)},
        remarks = ${toNull(remarks)},
        phone_number = ${toNull(phone_number)},
        email = ${toNull(email)},
        postal_code = ${toNull(postal_code)},
        address = ${toNull(address)},
        joining_date = ${toNull(joining_date)},
        retirement_date = ${toNull(retirement_date)},
        employment_id = ${Number(employment_id)},
        position_id = ${Number(position_id)},
        job_category_id = ${Number(job_category_id)}
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
