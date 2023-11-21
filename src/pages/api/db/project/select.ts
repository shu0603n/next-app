import { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const projectsPromise = prisma.project.findMany({
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
        price: true
      }
    });
  
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

    // 同時に実行して待つ
    const [projects, skill, client, contract, process] = await Promise.all([
      projectsPromise,
      skillPromise,
      clientPromise,
      contractPromise,
      processPromise
    ]);

    response.status(200).json({
      message: 'データを取得しました。',
      project: projects,
      skill: skill,
      client: client,
      contract: contract,
      process: process
    });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
