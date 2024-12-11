import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma';
import { selectEmployee } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');

    // プロジェクトを削除した後に残りのデータを並列で削除
    await Promise.all([
      prisma.employee_project.deleteMany({
        where: {
          employee_id: Number(id)
        }
      }),
      prisma.employee_project_skills.deleteMany({
        where: {
          employee_project_id: Number(id)
        }
      }),
      prisma.employee_project_processes.deleteMany({
        where: {
          employee_project_id: Number(id)
        }
      })
    ]);

    // Prismaを使用してデータを削除
    await prisma.employee.deleteMany({
      where: {
        id: Number(id)
      }
    });

    // データを再取得
    const employee = await selectEmployee;
    return response.status(200).json({ employee });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    // モジュールの終了時に PrismaClient を切断
    await prisma.$disconnect();
  }
}
