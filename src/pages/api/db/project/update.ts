import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
    const {
      id,
      hp_posting_flag,
      client_id,
      contract_id,
      working_postal_code,
      working_address,
      working_start_time,
      working_end_time,
      holiday,
      project_title,
      description
      // ,
      // skills,
      // process
    } = request.body;

    if (!project_title) {
      throw new Error('パラメーターが不足しています');
    }

    if (id) {
      const updateResult = await sql`
        UPDATE project
        SET
          hp_posting_flag = ${hp_posting_flag},
          client_id = ${client_id ?? null},
          contract_id = ${contract_id ?? null},
          working_postal_code = ${toNull(working_postal_code)},
          working_address = ${toNull(working_address)},
          working_start_time = ${toNull(working_start_time)},
          working_end_time = ${toNull(working_end_time)},
          holiday = ${toNull(holiday)},
          project_title = ${toNull(project_title)},
          description = ${toNull(description)}
        WHERE
          id = ${Number(id)}
      `;

      if (updateResult.rowCount !== 1) {
        throw new Error('データの更新中に問題が発生しました');
      }

    }else{
     // IDが存在しない場合、新しいレコードをINSERT
     console.log(`
     INSERT INTO project (
       hp_posting_flag,
       client_id,
       contract_id,
       working_postal_code,
       working_address,
       working_start_time,
       working_end_time,
       holiday,
       project_title,
       description
     )
     VALUES (
       ${hp_posting_flag},
       ${client_id ?? null},
       ${contract_id ?? null},
       ${toNull(working_postal_code)},
       ${toNull(working_address)},
       ${toNull(working_start_time)},
       ${toNull(working_end_time)},
       ${toNull(holiday)},
       ${toNull(project_title)},
       ${toNull(description)}
     )
   `);
     const insertResult = await sql`
       INSERT INTO project (
         hp_posting_flag,
         client_id,
         contract_id,
         working_postal_code,
         working_address,
         working_start_time,
         working_end_time,
         holiday,
         project_title,
         description
       )
       VALUES (
         ${hp_posting_flag},
         ${client_id ?? null},
         ${contract_id ?? null},
         ${toNull(working_postal_code)},
         ${toNull(working_address)},
         ${toNull(working_start_time)},
         ${toNull(working_end_time)},
         ${toNull(holiday)},
         ${toNull(project_title)},
         ${toNull(description)}
       )
     `;
     if (insertResult.rowCount !== 1) {
       throw new Error('データの挿入中に問題が発生しました');
     }
    }

    // データを取得

    const data = await sql`
    SELECT
      project.id,
      project.hp_posting_flag,
      client.name AS client_Name,
      contract.name AS contract_Name,
      project.working_postal_code,
      project.working_address,
      project.working_start_time,
      project.working_end_time,
      project.holiday,
      project.project_title,
      project.description
  FROM project
  LEFT JOIN client ON project.client_id = client.id
  LEFT JOIN contract ON project.contract_id = contract.id;
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
