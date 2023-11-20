import { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // デバッグモードを有効にする
  log: ['query']
});

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        hp_posting_flag: true
      },
      select: {
        id: true,
        hp_posting_flag: true,
        client_id: true,
        contract_id: true,
        working_postal_code: true,
        working_address: true,
        holiday: true,
        project_title: true,
        description: true,
        working_start_time: true,
        working_end_time: true,
        price: true,
        client: true,
        contract: true,
        project_process: {
          select: {
            process: {
              select: {
                name: true
              }
            }
          }
        },
        project_skills: {
          select: {
            skill: {
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
      project: projects
    });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
