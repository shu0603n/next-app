import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma';

export const projectsPromise = prisma.project.findMany({
  select: {
    id: true,
    start_date: true,
    end_date: true,
    hp_posting_flag: true,
    client: { select: { id: true, name: true } },
    contract: { select: { id: true, name: true } },
    working_postal_code: true,
    working_address: true,
    working_start_time: true,
    working_end_time: true,
    holiday: true,
    project_title: true,
    description: true,
    price: true,

    employee: { select: { id: true, sei: true, mei: true } },
    dispatch_source: true,
    fertilizer_type: true,
    training_schedule: true,
    trial_period_duration: true,
    training_memo: true,
    contract_period: true,
    working_days_count: true,
    working_days_list: true,
    working_hours_per_day: true,
    work_notes: true,
    price_type: true,
    transportation_expenses: true,
    overtime_hours: true,
    welfare_programs: true,
    work_environment_description: true,
    dress_code: true,
    gender_ratio: true,
    environmental_notes: true,
    special_notes: true,
    hr_requirements: true,
    gender_requirements: true,
    age_requirements: true,
    recruitment_count: true
  }
});
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const skillPromise = prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        technic: { select: { id: true, name: true } },
        candidate_flag: true
      }
    });

    const clientPromise = prisma.client.findMany({ select: { id: true, name: true } });
    const contractPromise = prisma.contract.findMany({ select: { id: true, name: true } });
    const processPromise = prisma.process.findMany({ select: { id: true, name: true } });
    const employeePromise = prisma.employee.findMany({
      select: {
        id: true,
        sei: true,
        mei: true
      }
    });

    // 同時に実行して待つ
    const [projects, skill, client, contract, process, employee] = await Promise.all([
      projectsPromise,
      skillPromise,
      clientPromise,
      contractPromise,
      processPromise,
      employeePromise
    ]);

    response.status(200).json({
      message: 'データを取得しました。',
      project: projects,
      skill: skill,
      client: client,
      contract: contract,
      process: process,
      employee: employee
    });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
