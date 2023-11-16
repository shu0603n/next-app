import { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // const {id} = request.body;
    console.log(request.body);
    const id = 1;

    const data = await prisma.project.findMany({
      where: {
        id: id
      }
    });
    const skill = await prisma.skill.findMany({
      where: {
        id: id
      },
      include: {
        technic: {
          select: {
            name: true
          }
        }
      }
    });
    const client = await prisma.client.findMany({ select: { id: true, name: true } });
    const process = await prisma.process.findMany({ select: { id: true, name: true } });
    const contract = await prisma.contract.findMany({ select: { id: true, name: true } });
    const skills_used = await prisma.skills_used.findMany({
      where: {
        employee_skills_id: Number(id)
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
      data: data,
      client: client,
      contract: contract,
      skill: skill,
      process: process,
      skills_used: skills_used
    });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
