import { PrismaClient } from '@prisma/client';
import { NextApiResponse, NextApiRequest } from 'next';

const prisma = new PrismaClient();

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');

    // プロジェクトを削除した後に残りのデータを並列で削除
    await Promise.all([
      prisma.project_skills.deleteMany({
        where: {
          project_id: Number(id)
        }
      }),
      prisma.project_process.deleteMany({
        where: {
          project_id: Number(id)
        }
      })
    ]);

    // Prismaを使用してデータを削除
    await prisma.project.deleteMany({
      where: {
        id: Number(id)
      }
    });

    // データを再取得
    const projects = await prisma.project.findMany({
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
    return response.status(200).json({ projects });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    // モジュールの終了時に PrismaClient を切断
    await prisma.$disconnect();
  }
}
