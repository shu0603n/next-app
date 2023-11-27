import { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id;

    const projectProcessPromise = prisma.project_process.findMany({
      where: {
        project_id: Number(id)
      },
      select: {
        process: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    const projectSkillsPromise = prisma.project_skills.findMany({
      where: {
        project_id: Number(id)
      },
      select: {
        skill: {
          select: {
            id: true,
            name: true,
            candidate_flag: true,
            technic: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // 同時に実行して待つ
    const [project_process, project_skills] = await Promise.all([projectProcessPromise, projectSkillsPromise]);

    response.status(200).json({
      message: 'データを取得しました。',
      project_process: project_process,
      project_skills: project_skills
    });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
