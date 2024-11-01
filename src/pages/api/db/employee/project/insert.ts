import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
    const { start_date, end_date, project_title, description, people_number, client_id, skills, process } = request.body;

    if (!project_title || !start_date) {
      throw new Error('パラメーターが不足しています');
    }

    const result = await sql`
      INSERT INTO employee_project (
        employee_id,
        start_date,
        end_date,
        project_title,
        description,
        people_number,
        client_id
      )
      VALUES (
        ${toNull(id)},
        ${toNull(start_date)},
        ${toNull(end_date)},
        ${toNull(project_title)},
        ${toNull(description)},
        ${toNull(people_number)},
        ${toNull(client_id)}
      )RETURNING id;
    `;

    if (result.rowCount === 0) {
      throw new Error('データを挿入できませんでした');
    }

    const employeeProjectId = result.rows[0].id;

    if (skills && skills.length > 0) {
      for (const skillName of skills) {
        const skillResult = await sql`
        SELECT id FROM skill WHERE name = ${skillName};
      `;

        if (skillResult.rowCount > 0) {
          const skillId = skillResult.rows[0].id;

          await sql`
          INSERT INTO employee_project_skills (
            employee_project_id,
            skill_id
          )
          VALUES (
            ${employeeProjectId},
            ${skillId}
          );
        `;
        }
      }
    }

    if (process && process.length > 0) {
      for (const processName of process) {
        const processResult = await sql`
        SELECT id FROM process WHERE name = ${processName};
      `;

        if (processResult.rowCount > 0) {
          const processId = processResult.rows[0].id;

          await sql`
          INSERT INTO employee_project_processes (
            employee_project_id,
            process_id
          )
          VALUES (
            ${employeeProjectId},
            ${processId}
          );
        `;
        }
      }
    }

    const data = await sql`
    SELECT 
    	employee_project.*,
        client.name AS client_name
    FROM 
        employee_project
    LEFT JOIN 
        client ON employee_project.client_id = client.id
    WHERE 
        employee_project.employee_id = ${id};
    `;
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
