import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
    const {
      id,
      employee_id,
      Hp_posting_flag,
      Client_id,
      Contract_id,
      Working_postal_code,
      Working_address,
      Working_start_time,
      Working_end_time,
      Holiday,
      Project_title,
      Description,
      skills,
      process
    } = request.body;

    if (!id || !employee_id) {
      throw new Error('パラメーターが不足しています');
    }

    // 既存のデータをUPDATE
    const updateResult = await sql`
      UPDATE project
      SET
        Hp_posting_flag = ${Hp_posting_flag},
        Client_id = ${Number(Client_id)},
        Contract_id = ${Number(Contract_id)},
        Working_postal_code = ${toNull(Working_postal_code)},
        Working_address = ${toNull(Working_address)},
        Working_start_time = ${toNull(Working_start_time)},
        Working_end_time = ${toNull(Working_end_time)},
        Holiday = ${toNull(Holiday)},
        Project_title = ${toNull(Project_title)},
        Description = ${toNull(Description)}
      WHERE
        id = ${Number(id)}
    `;

    if (updateResult.rowCount === 0) {
      // IDが存在しない場合、新しいレコードをINSERT
      const insertResult = await sql`
        INSERT INTO project (
          Id,
          Hp_posting_flag,
          Client_id,
          Contract_id,
          Working_postal_code,
          Working_address,
          Working_start_time,
          Working_end_time,
          Holiday,
          Project_title,
          Description
        )
        VALUES (
          ${Number(employee_id)},
          ${Hp_posting_flag},
          ${Number(Client_id)},
          ${Number(Contract_id)},
          ${toNull(Working_postal_code)},
          ${toNull(Working_address)},
          ${toNull(Working_start_time)},
          ${toNull(Working_end_time)},
          ${toNull(Holiday)},
          ${toNull(Project_title)},
          ${toNull(Description)}
        )
      `;
      if (insertResult.rowCount !== 1) {
        throw new Error('データの挿入中に問題が発生しました');
      }
    }

    skills.forEach(async (value: any) => {
      const { Employee_skills_id, Skill_id, id } = value; // skillオブジェクトから必要なプロパティを取得

      // UPDATEのSQLクエリを実行
      const updateSkillResult = await sql`
        UPDATE skills_used
        SET
          Employee_skills_id = ${toNull(Employee_skills_id)},
          Skill_id = ${toNull(Skill_id)}
        WHERE
          id = ${Number(id)}
      `;

      if (updateSkillResult.rowCount === 0) {
        // IDが存在しない場合、新しいレコードをINSERT
        const insertResult = await sql`
          INSERT INTO skills_used (
            Employee_skills_id,
            Skill_id
          )
          VALUES (
            ${Number(Employee_skills_id)},
            ${Number(Skill_id)}
          `;
        if (insertResult.rowCount !== 1) {
          throw new Error('データの挿入中に問題が発生しました');
        }
      }
    });

    process.forEach(async (value: any) => {
      console.log(value);
      const { Employee_skills_id, Process_id, id } = value; // skillオブジェクトから必要なプロパティを取得

      // UPDATEのSQLクエリを実行
      const updateSkillResult = await sql`
        UPDATE process_used
        SET
          Employee_skills_id = ${toNull(Employee_skills_id)},
          Process_id = ${toNull(Process_id)}
        WHERE
          id = ${Number(id)}
      `;

      if (updateSkillResult.rowCount === 0) {
        // IDが存在しない場合、新しいレコードをINSERT
        const insertResult = await sql`
          INSERT INTO process_used (
            Employee_skills_id,
            Process_id
          )
          VALUES (
            ${Number(Employee_skills_id)},
            ${Number(Process_id)}
          `;
        if (insertResult.rowCount !== 1) {
          throw new Error('データの挿入中に問題が発生しました');
        }
      }
    });

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
