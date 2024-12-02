import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

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
            name: true
          }
        },
        project_position: {
          select: {
            name: true,
            description: true
          }
        },
        employee_project_processes: {
          select: {
            process: {
              select: {
                name: true
              }
            }
          }
        },
        employee_project_skills: {
          select: {
            skill: {
              select: {
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

    // 同時に実行して待つ
    const [skill, technic, process, projectPosition, client] = await Promise.all([
      skillPromise,
      technicPromise,
      processPromise,
      project_positionPromise,
      clientPromise
    ]);

    // const formattedData = employeeProjectData.map((project) => ({
    //   ...project,
    //   client: project.client,
    //   project_position: project.
    //   start_date: project.start_date,
    //   end_date: project.end_date
    //   skills: project.employee_project_skills.map((skill) => skill.skill?.name),
    //   processes: project.employee_project_processes.map((process) => process.process?.name),
    //   client_name: project.client?.name,
    // }));

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
