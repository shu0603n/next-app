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
    console.log(request.body);

    if (!id) {
      throw new Error('パラメーターが不足しています');
    }

    // 既存のデータをUPDATE
    console.log(`
    UPDATE project
    SET
      hp_posting_flag = ${hp_posting_flag ?? null},
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
  `);
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

    if (updateResult.rowCount === 0) {
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
    // skills.forEach(async (value: any) => {
    //   const { Employee_skills_id, Skill_id, id } = value; // skillオブジェクトから必要なプロパティを取得

    //   // UPDATEのSQLクエリを実行
    //   const updateSkillResult = await sql`
    //     UPDATE skills_used
    //     SET
    //       Employee_skills_id = ${toNull(Employee_skills_id)},
    //       Skill_id = ${toNull(Skill_id)}
    //     WHERE
    //       id = ${Number(id)}
    //   `;

    //   if (updateSkillResult.rowCount === 0) {
    //     // IDが存在しない場合、新しいレコードをINSERT
    //     const insertResult = await sql`
    //       INSERT INTO skills_used (
    //         Employee_skills_id,
    //         Skill_id
    //       )
    //       VALUES (
    //         ${Number(Employee_skills_id)},
    //         ${Number(Skill_id)}
    //       `;
    //     if (insertResult.rowCount !== 1) {
    //       throw new Error('データの挿入中に問題が発生しました');
    //     }
    //   }
    // });

    // process.forEach(async (value: any) => {
    //   console.log(value);
    //   const { Employee_skills_id, Process_id, id } = value; // skillオブジェクトから必要なプロパティを取得

    //   // UPDATEのSQLクエリを実行
    //   const updateSkillResult = await sql`
    //     UPDATE process_used
    //     SET
    //       Employee_skills_id = ${toNull(Employee_skills_id)},
    //       Process_id = ${toNull(Process_id)}
    //     WHERE
    //       id = ${Number(id)}
    //   `;

    //   if (updateSkillResult.rowCount === 0) {
    //     // IDが存在しない場合、新しいレコードをINSERT
    //     const insertResult = await sql`
    //       INSERT INTO process_used (
    //         Employee_skills_id,
    //         Process_id
    //       )
    //       VALUES (
    //         ${Number(Employee_skills_id)},
    //         ${Number(Process_id)}
    //       `;
    //     if (insertResult.rowCount !== 1) {
    //       throw new Error('データの挿入中に問題が発生しました');
    //     }
    //   }
    // });

    // データを取得

    const data = await sql`
    SELECT
        skill.id,
        skill.name,
        technic.name AS technic_name,
        skill.candidate_flag 
    FROM
        skills_used
    INNER JOIN
        skill
    ON
        skills_used.Skill_id = skill.id
    LEFT JOIN
        technic
    ON
        skill.Technic_id = technic.id
    WHERE
        skills_used.employee_skills_id = ${Number(id)}
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
