import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const employeeId = request.query.id as string;
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };

    const { id, start_date, end_date, project_title, client_name, description, people_number, skills, process, project_position_name } =
      request.body;

    console.log('Received skills:', skills);

    // 必須パラメータのチェック
    if (!id || !project_title || !start_date) {
      throw new Error('パラメーターが不足しています');
    }

    let client_id = null;
    if (client_name) {
      const clientResult = await sql`
        SELECT id FROM client WHERE name = ${client_name};
      `;

      if (clientResult.rowCount > 0) {
        client_id = clientResult.rows[0].id; // 該当するIDを取得
      } else {
        throw new Error('指定された役割名が見つかりません');
      }
    }

    let project_position_id = null;
    if (project_position_name) {
      const positionResult = await sql`
        SELECT id FROM project_position WHERE name = ${project_position_name};
      `;

      if (positionResult.rowCount > 0) {
        project_position_id = positionResult.rows[0].id; // 該当するIDを取得
      } else {
        throw new Error('指定された役割名が見つかりません');
      }
    }

    // 更新クエリ
    const result = await sql`
    UPDATE employee_project
    SET 
      start_date = ${toNull(start_date)},
      end_date = ${toNull(end_date)},
      project_title = ${toNull(project_title)},
      description = ${toNull(description)},
      people_number = ${toNull(people_number)},
      client_id = ${toNull(client_id)},
      project_position_id = ${toNull(project_position_id)}
    WHERE 
      id = ${toNull(id)};
    `;

    // 更新された行数の確認
    if (result.rowCount === 0) {
      throw new Error('データを更新できませんでした');
    }

    // employee_project_idを取得するためにSELECTを実行
    const employeeProjectIdResult = await sql`
    SELECT id FROM employee_project WHERE id = ${id};
    `;

    if (employeeProjectIdResult.rowCount === 0) {
      throw new Error('指定されたプロジェクトIDが存在しません');
    }

    const employeeProjectId = employeeProjectIdResult.rows[0].id;

    // 既存のスキルデータを削除
    await sql`
    DELETE FROM employee_project_skills
    WHERE employee_project_id = ${employeeProjectId};
    `;

    await sql`
    DELETE FROM employee_project_processes
    WHERE employee_project_id = ${employeeProjectId};
    `;

    // employee_project_skillsテーブルにスキルを追加
    if (skills && skills.length > 0) {
      for (const skillName of skills) {
        const skillResult = await sql`
        SELECT id FROM skill WHERE name = ${skillName};
      `;

        if (skillResult.rowCount > 0) {
          const skillId = skillResult.rows[0].id;

          await sql`
          INSERT INTO employee_project_skills (employee_project_id, skill_id)
          VALUES (${employeeProjectId}, ${skillId})
          `;
        }
      }
    }

    // employee_project_processesテーブルにスキルを追加
    if (process && process.length > 0) {
      for (const processName of process) {
        const processResult = await sql`
        SELECT id FROM process WHERE name = ${processName};
      `;

        if (processResult.rowCount > 0) {
          const processId = processResult.rows[0].id;

          await sql`
          INSERT INTO employee_project_processes (employee_project_id, process_id)
          VALUES (${employeeProjectId}, ${processId})
          `;
        }
      }
    }

    // 更新後のデータを取得
    const data = await sql`
    SELECT 
      employee_project.*,
      client.name AS client_name,
      pp.name AS project_position_name,
      pp.description AS project_position_description,
      array_agg(DISTINCT s.name) AS skills,
      array_agg(DISTINCT p.name) AS process
    FROM 
      employee_project
    LEFT JOIN 
      client ON employee_project.client_id = client.id
    LEFT JOIN 
      employee_project_skills eps ON employee_project.id = eps.employee_project_id
    LEFT JOIN 
      skill s ON eps.skill_id = s.id
    LEFT JOIN
      employee_project_processes epp ON employee_project.id = epp.employee_project_id
    LEFT JOIN 
      process p ON epp.process_id = p.id
    LEFT JOIN
      project_position pp ON employee_project.project_position_id = pp.id
    WHERE 
      employee_project.employee_id = ${employeeId}
    GROUP BY 
      employee_project.id, client.name, pp.name, pp.description;
    ORDER BY employee_project.start_date DESC;
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
