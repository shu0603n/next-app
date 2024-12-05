import { PrismaClient } from '@prisma/client';
import { NextApiResponse, NextApiRequest } from 'next';

const prisma = new PrismaClient();

export const selectData = async (id: string) => {
  const data = await prisma.employee.findUnique({
    where: {
      id: parseInt(id)
    },
    include: {
      employment: true,
      position: true
    }
  });
  return data;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;

    const skillsWithTechnics = await prisma.skill.findMany({
      where: {
        employee_project_skills: {
          some: {
            employee_project: {
              employee_id: parseInt(id) // 指定した employee_id でフィルタリング
            }
          }
        }
      },
      distinct: ['name'], // 'name' 列の重複を排除
      orderBy: [
        { technic: { id: 'asc' } }, // technic.id で昇順に並び替え
        { name: 'asc' } // skill.name で昇順に並び替え
      ],
      select: {
        name: true, // skill.name を選択
        technic: {
          select: {
            name: true // technic.name を選択
          }
        }
      }
    });
    const allSkills = skillsWithTechnics.map((skill) => ({
      skill_name: skill.name,
      technic_name: skill.technic?.name
    }));

    // Prismaを使ってデータを取得
    const data = await selectData(id);

    // データが見つからない場合は404エラーを返す
    if (!data) {
      return response.status(404).json({ error: '社員が見つかりません' });
    }

    // データが見つかった場合は成功レスポンスを返す
    return response.status(200).json({ data, allSkills });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
