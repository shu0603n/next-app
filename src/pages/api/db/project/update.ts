import { NextApiRequest, NextApiResponse } from 'next';
import { ParameterType, SkillParameterType } from 'types/parameter/parameter';
import { prisma } from '../prisma';
import { projectsPromise } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const {
      id,
      start_date,
      end_date,
      hp_posting_flag,
      client,
      contract,
      working_postal_code,
      working_address,
      working_start_time,
      working_end_time,
      holiday,
      project_title,
      description,
      price,
      skills,
      process,
      employee,
      dispatch_source,
      fertilizer_type,
      training_schedule,
      trial_period_duration,
      training_memo,
      contract_period,
      working_days_count,
      working_days_list,
      working_hours_per_day,
      work_notes,
      price_type,
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
    } = request.body;

    const skillIds = skills?.map((skillItem: SkillParameterType) => skillItem?.id) ?? [];
    const processIds = process?.map((processItem: ParameterType) => processItem?.id) ?? [];

    if (!project_title) {
      throw new Error('パラメーターが不足しています');
    }

    if (id) {
      const updateProject = prisma.project.update({
        where: { id: Number(id) },
        data: {
          hp_posting_flag,
          start_date,
          end_date,
          client: client ? { connect: { id: client.id } } : undefined,
          contract: contract ? { connect: { id: contract.id } } : undefined,
          working_postal_code,
          working_address,
          working_start_time,
          working_end_time,
          holiday,
          project_title,
          description,
          employee: employee ? { connect: { id: employee.id } } : undefined,
          dispatch_source,
          fertilizer_type,
          training_schedule,
          trial_period_duration,
          training_memo,
          contract_period,
          working_days_count,
          working_days_list,
          working_hours_per_day,
          work_notes,
          price: Number(price),
          price_type: Number(price_type),
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
        },
      });

      const deleteSkillsAndProcesses = Promise.all([
        prisma.project_skills.deleteMany({ where: { project_id: Number(id) } }),
        prisma.project_process.deleteMany({ where: { project_id: Number(id) } }),
      ]);

      await Promise.all([updateProject, deleteSkillsAndProcesses]);

      if (skillIds.length > 0) {
        await prisma.project_skills.createMany({
          data: skillIds.map((skillId: number) => ({ project_id: Number(id), skill_id: skillId })),
        });
      }

      if (processIds.length > 0) {
        await prisma.project_process.createMany({
          data: processIds.map((processId: number) => ({ project_id: Number(id), process_id: processId })),
        });
      }

    } else {
      const newProject = await prisma.project.create({
        data: {
          hp_posting_flag,
          start_date,
          end_date,
          client: client ? { connect: { id: client.id } } : undefined,
          contract: contract ? { connect: { id: contract.id } } : undefined,
          working_postal_code,
          working_address,
          working_start_time,
          working_end_time,
          holiday,
          project_title,
          description,
          employee: employee ? { connect: { id: employee.id } } : undefined,
          dispatch_source,
          fertilizer_type,
          training_schedule,
          trial_period_duration,
          training_memo,
          contract_period,
          working_days_count,
          working_days_list,
          working_hours_per_day,
          work_notes,
          price: Number(price),
          price_type: Number(price_type),
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
        },
      });

      if (skillIds.length > 0) {
        await prisma.project_skills.createMany({
          data: skillIds.map((skillId: number) => ({ project_id: newProject.id, skill_id: skillId })),
        });
      }

      if (processIds.length > 0) {
        await prisma.project_process.createMany({
          data: processIds.map((processId: number) => ({ project_id: newProject.id, process_id: processId })),
        });
      }
    }

    const projects = await projectsPromise;
    return response.status(200).json({ projects });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
