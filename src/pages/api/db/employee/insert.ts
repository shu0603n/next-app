import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
    const {
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

    if (!sei || !mei) {
      throw new Error('パラメーターが不足しています');
    }

    const result = await sql`
    INSERT INTO employee (
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
    )
    VALUES (
      ${toNull(sei)},
      ${toNull(mei)},
      ${toNull(sei_k)},
      ${toNull(mei_k)},
      ${toNull(gender)},
      ${toNull(birthday)},
      ${toNull(remarks)},
      ${toNull(phone_number)},
      ${toNull(email)},
      ${toNull(postal_code)},
      ${toNull(address)},
      ${toNull(joining_date)},
      ${toNull(retirement_date)},
      ${toNull(employment_id)},
      ${toNull(position_id)},
      ${toNull(job_category_id)}
    );
  `;

    if (result.rowCount === 0) {
      throw new Error('データを挿入できませんでした');
    }

    if (result.rowCount !== 1) {
      throw new Error('複数のレコードが更新されてしまった可能性があります');
    }

    const data = await sql`
    SELECT 
        emp.id,
        emp.sei || ' ' || emp.mei AS name,
        emp.sei_k || ' ' || emp.mei_k AS name_k,
        emp.gender,
        Job_category.name AS job_category_name,
        Employment.name AS employment_name
    FROM employee AS emp
    LEFT JOIN job_category 
        ON emp.job_category_id = job_category.id
    LEFT JOIN employment
        ON emp.employment_id = employment.id;
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
