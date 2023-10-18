import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
    const { employee_id, date, start_time, location } = request.body;
    const dateFormat = new Date(date);
    const year = dateFormat.getFullYear(); // 年を取得
    const month = dateFormat.getMonth() + 1; // 月を取得 (0から始まるので+1)

    if (!employee_id || !date) {
      throw new Error('パラメーターが不足しています');
    }

    // 既存のデータをUPDATE
    const updateResult = await sql`
      UPDATE attendance
      SET
        start_time = ${toNull(start_time)}
      WHERE
        employee_id = ${Number(employee_id)} AND
        date = ${toNull(date)}
    `;

    if (updateResult.rowCount === 0) {
      // IDが存在しない場合、新しいレコードをINSERT
      const insertResult = await sql`
        INSERT INTO attendance (employee_id, date, start_time, location)
        VALUES (
          ${Number(employee_id)},
          ${toNull(date)},
          ${toNull(start_time)},
          ${toNull(location)}
        )
      `;
      if (insertResult.rowCount !== 1) {
        throw new Error('データの挿入中に問題が発生しました');
      }
    }

    // データを取得

    const data = await sql`
      SELECT 
        employee_id,
        TO_CHAR(date, 'YYYY/MM/DD') AS date,
        TO_CHAR(start_time, 'HH24:MI') AS start_time,
        TO_CHAR(end_time, 'HH24:MI') AS end_time,
        location
      FROM 
        attendance
      WHERE 
        employee_id = ${Number(employee_id)}
        AND EXTRACT(YEAR FROM date) = ${year}
        AND EXTRACT(MONTH FROM date) = ${month};
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
