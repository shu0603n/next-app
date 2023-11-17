import { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // デバッグモードを有効にする
  log: ['query']
});

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id;

    const project_process = await prisma.project_process.findMany({
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
    const project_skills = await prisma.project_skills.findMany({
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
