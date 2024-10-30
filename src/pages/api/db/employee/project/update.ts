import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };

    const { id, start_date, end_date, project_title, description, people_number, client_id } = request.body;

    // 必須パラメータのチェック
    if (!id || !project_title || !start_date) {
      throw new Error('パラメーターが不足しています');
    }

    // 更新クエリ
    const result = await sql`
    UPDATE employee_skills
    SET 
      start_date = ${toNull(start_date)},
      end_date = ${toNull(end_date)},
      project_title = ${toNull(project_title)},
      description = ${toNull(description)},
      people_number = ${toNull(people_number)},
      client_id = ${toNull(client_id)}
    WHERE 
      id = ${toNull(id)};
    `;

    // 更新された行数の確認
    if (result.rowCount === 0) {
      throw new Error('データを更新できませんでした');
    }

    if (result.rowCount !== 1) {
      throw new Error('複数のレコードが更新されてしまった可能性があります');
    }

    // 更新後のデータを取得
    const data = await sql`
    SELECT 
      employee_skills.*,
      client.name AS client_name
    FROM 
      employee_skills
    LEFT JOIN 
      client ON employee_skills.client_id = client.id
    WHERE 
      employee_skills.employee_id = ${id};
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
