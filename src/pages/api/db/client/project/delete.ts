import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export default async function deleteProject(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;
    if (!id) throw new Error('パラメーターが不足しています');

    await prisma.project_skills.deleteMany({
      where: {
        project_id: Number(id)
      }
    });

    await prisma.project_process.deleteMany({
      where: {
        project_id: Number(id)
      }
    });

    // projectと関連するデータを削除
    const deleteProject = await prisma.project.deleteMany({
      where: {
        id: Number(id)
      }
    });

    // 削除された件数をチェック
    if (deleteProject.count === 0) {
      return response.status(404).json({ error: '削除対象が見つかりませんでした。' });
    }

    return response.status(200).json({ message: '削除が成功しました。' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを削除できませんでした。' });
  }
}
