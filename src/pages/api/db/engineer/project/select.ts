import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export const selectEmployeePrijects = async (employeeId: string) => {
  const employeeProjectData = await prisma.employee_project.findMany({
    where: {
      employee_id: parseInt(employeeId, 10)
    },
    select: {
      id: true,
      start_date: true,
      end_date: true,
      project_title: true,
      description: true,
      people_number: true,
      client: {
        select: {
          id: true,
          name: true
        }
      },
      project_position: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      employee_project_processes: {
        select: {
          process: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      employee_project_skills: {
        select: {
          skill: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      start_date: 'desc'
    }
  });
  // データ整形
  const formattedData = employeeProjectData.map((project) => {
    const skills = project.employee_project_skills.map((item) => item.skill);
    const processes = project.employee_project_processes.map((item) => item.process);
    return {
      ...project,
      employee_project_skills: skills,
      employee_project_processes: processes
    };
  });

  return formattedData;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const employeeId = request.query.id as string;

    const skillPromise = prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        candidate_flag: true
      }
    });

    const technicPromise = prisma.technic.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const processPromise = prisma.process.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const project_positionPromise = prisma.project_position.findMany({
      select: {
        id: true,
        name: true,
        description: true
      }
    });

    const clientPromise = prisma.client.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const employeeProjectData = await selectEmployeePrijects(employeeId);

    // 同時に実行して待つ
    const [skill, technic, process, projectPosition, client] = await Promise.all([
      skillPromise,
      technicPromise,
      processPromise,
      project_positionPromise,
      clientPromise
    ]);

    return response.status(200).json({
      data: employeeProjectData,
      skill,
      technic,
      process,
      role: projectPosition,
      client
    });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
