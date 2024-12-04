import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const employeeId = request.query.id as string;
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };

    const {
      id,
      start_date,
      end_date,
      working_start_time,
      working_end_time,
      project_title,
      client_name,
      sei,
      dispatch_source,
      contract_name,
      working_postal_code,
      fertilizer_type,
      working_address,
      holiday,
      description,
      training_schedule,
      trial_period_duration,
      training_memo,
      contract_period,
      working_days_count,
      working_days_list,
      working_hours_per_day,
      work_notes,
      price_type,
      price,
      transportation_expenses,
      overtime_hours,
      welfare_programs,
      work_environment_description,
      dress_code,
      gender_ratio,
      environmental_notes,
      special_notes,
      hr_requirements,
      gender_requirements,
      age_requirements,
      recruitment_count,
      skills,
      processes,
      hp_posting_flag
    } = request.body;

    // 必須パラメータのチェック
    if (!id || !hp_posting_flag) {
      throw new Error('パラメーターが不足しています');
    }

    // 企業名からclient_idを取得
    let client_id = null;
    if (client_name) {
      const clientResult = await sql`
        SELECT id FROM client WHERE name = ${client_name};
      `;

      client_id = clientResult.rows[0].id;
    }

    // 契約区分からclient_idを取得
    let contract_id = null;
    if (contract_name) {
      const contractResult = await sql`
        SELECT id FROM contract WHERE name = ${contract_name};
      `;

      contract_id = contractResult.rows[0].id;
    }

    // 担当者からemployee_idを取得
    let employee_id = null;
    if (sei) {
      const employeeResult = await sql`
        SELECT id FROM employee WHERE sei = ${sei};
      `;

      employee_id = employeeResult.rows[0].id;
    }

    // 更新クエリ
    const updatedProject = await sql`
    UPDATE project
    SET 
      id = ${toNull(id)},
      start_date = ${toNull(start_date)},
      end_date = ${toNull(end_date)},
      working_start_time = ${toNull(working_start_time)},
      working_end_time = ${toNull(working_end_time)},
      project_title = ${toNull(project_title)},
      client_name = ${toNull(client_name)},
      sei = ${toNull(sei)},
      dispatch_source = ${toNull(dispatch_source)},
      contract_name = ${toNull(contract_name)},
      working_postal_code = ${toNull(working_postal_code)},
      fertilizer_type = ${toNull(fertilizer_type)},
      working_address = ${toNull(working_address)},
      holiday = ${toNull(holiday)},
      description = ${toNull(description)},
      training_schedule = ${toNull(training_schedule)},
      trial_period_duration = ${toNull(trial_period_duration)},
      training_memo = ${toNull(training_memo)},
      contract_period = ${toNull(contract_period)},
      working_days_count = ${toNull(working_days_count)},
      working_days_list = ${toNull(working_days_list)},
      working_hours_per_day = ${toNull(working_hours_per_day)},
      work_notes = ${toNull(work_notes)},
      price_type = ${toNull(price_type)},
      price = ${toNull(price)},
      transportation_expenses = ${toNull(transportation_expenses)},
      overtime_hours = ${toNull(overtime_hours)},
      welfare_programs = ${toNull(welfare_programs)},
      work_environment_description = ${toNull(work_environment_description)},
      dress_code = ${toNull(dress_code)},
      gender_ratio = ${toNull(gender_ratio)},
      environmental_notes = ${toNull(environmental_notes)},
      special_notes = ${toNull(special_notes)},
      hr_requirements = ${toNull(hr_requirements)},
      gender_requirements = ${toNull(gender_requirements)},
      age_requirements = ${toNull(age_requirements)},
      recruitment_count = ${toNull(recruitment_count)},
      skills = ${toNull(skills)},
      processes = ${toNull(processes)},
      hp_posting_flag = ${toNull(hp_posting_flag)},
      client_id = ${toNull(client_id)},
      contract_id = ${toNull(contract_id)}
      employee_id = ${toNull(employee_id)}
    `;

    // 更新された行数の確認
    if (updatedProject.rowCount === 0) {
      throw new Error('データを更新できませんでした');
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
      employee_project.id, client.name, pp.name, pp.description
    ORDER BY employee_project.start_date DESC;
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
