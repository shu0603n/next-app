import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { selectEmployeePrijects } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const employeeId = request.query.id as string;
    const toNull = (str: any) => {
      return str === null || str === '' || str === undefined ? null : str;
    };

    const {
      start_date,
      end_date,
      project_title,
      client,
      description,
      people_number,
      employee_project_skills,
      employee_project_processes,
      project_position
    } = request.body;

    console.log('Received skills:', employee_project_skills);

    // 必須パラメータのチェック
    if (!project_title || !start_date) {
      return response.status(400).json({ error: 'パラメーターが不足しています' });
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

    // 新しいプロジェクトの作成
    const newProject = await prisma.employee_project.create({
      data: {
        employee_id: Number(employeeId),
        start_date: toNull(formattedStartDate),
        end_date: toNull(formattedEndDate),
        project_title: toNull(project_title),
        description: toNull(description),
        people_number: Number(people_number),
        client_id: client ? client.id : null,
        project_position_id: project_position ? project_position.id : null
      }
    });

    // スキルとプロセスの挿入
    const createSkillsPromises =
      employee_project_skills && Array.isArray(employee_project_skills) && employee_project_skills.length > 0
        ? employee_project_skills
            .map((skill) => {
              if (skill) {
                return prisma.employee_project_skills.create({
                  data: {
                    employee_project_id: newProject.id,
                    skill_id: skill.id
                  }
                });
              }
            })
            .filter(Boolean) // 空でないPromiseだけをフィルタリング
        : [];

    const createProcessesPromises =
      employee_project_processes && Array.isArray(employee_project_processes) && employee_project_processes.length > 0
        ? employee_project_processes
            .map((process) => {
              if (process) {
                return prisma.employee_project_processes.create({
                  data: {
                    employee_project_id: newProject.id,
                    process_id: process.id
                  }
                });
              }
            })
            .filter(Boolean) // 空でないPromiseだけをフィルタリング
        : [];

    // 並列でスキルとプロセスを追加
    await Promise.all([...createSkillsPromises, ...createProcessesPromises]);

    const data = await selectEmployeePrijects(employeeId);

    return response.status(200).json({ data });
  } catch (error: any) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: error.message || 'データを作成できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}