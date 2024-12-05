import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const projectId = request.query.id as string;
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

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date.toISOString() : null; // returns null if invalid
    };

    const formattedStartDate = formatDate(start_date);
    const formattedEndDate = formatDate(end_date);

    if (!formattedStartDate || !formattedEndDate) {
      return response.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
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
      start_date = ${toNull(formattedStartDate)},
      end_date = ${toNull(formattedEndDate)},
      working_start_time = ${toNull(working_start_time)},
      working_end_time = ${toNull(working_end_time)},
      project_title = ${toNull(project_title)},
      dispatch_source = ${toNull(dispatch_source)},
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
      hp_posting_flag = ${toNull(hp_posting_flag)},
      client_id = ${toNull(client_id)},
      contract_id = ${toNull(contract_id)},
      employee_id = ${toNull(employee_id)}
    WHERE id = ${projectId};
  `;

    // 更新された行数の確認
    if (updatedProject.rowCount === 0) {
      throw new Error('データを更新できませんでした');
    }

    // 既存のスキルデータを削除
    if (updatedProject) {
      await prisma.project_skills.deleteMany({
        where: { project_id: id }
      });

      await prisma.project_process.deleteMany({
        where: { project_id: id }
      });

      // 並列でスキルとプロセスを追加
      const createSkillsPromises =
        skills && Array.isArray(skills) && skills.length > 0
          ? skills
              .map((skill) => {
                if (skill) {
                  return prisma.project_skills.create({
                    data: {
                      project_id: id,
                      skill_id: skill.id
                    }
                  });
                }
              })
              .filter(Boolean) // 空でないPromiseだけをフィルタリング
          : [];

      const createProcessesPromises =
        processes && Array.isArray(processes) && processes.length > 0
          ? processes
              .map((process) => {
                if (process) {
                  return prisma.project_process.create({
                    data: {
                      project_id: id,
                      process_id: process.id
                    }
                  });
                }
              })
              .filter(Boolean) // 空でないPromiseだけをフィルタリング
          : [];

      // 並列でスキルとプロセスを追加
      await Promise.all([...createSkillsPromises, ...createProcessesPromises]);
    }

    // 更新後のデータを取得
    const data = await sql`
    SELECT 
      client.id,
      client.name AS client_name,
      project.*,
      employee.sei,
      contract.name AS contract_name,
      array_agg(DISTINCT skill.name) AS skills,
      array_agg(DISTINCT process.name) AS processes
    FROM 
      client
    LEFT JOIN 
      project ON client.id = project.client_id
    LEFT JOIN 
      employee ON project.employee_id = employee.id
    LEFT JOIN 
      contract ON project.contract_id = contract.id
    LEFT JOIN 
      project_skills ON project.id = project_skills.project_id
    LEFT JOIN 
      skill ON project_skills.skill_id = skill.id
    LEFT JOIN 
      project_process ON project.id = project_process.project_id
    LEFT JOIN 
      process ON project_process.process_id = process.id
    WHERE 
      client.id = ${projectId}
    GROUP BY
      client.id, project.id, employee.id, contract.id
    ORDER BY 
      project.start_date DESC;
    `;

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
