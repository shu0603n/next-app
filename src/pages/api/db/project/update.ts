// pages/api/your-api-route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ParameterType, SkillParameterType } from 'types/parameter/parameter';
import { prisma } from '../prisma';
import { projectsPromise } from './select';

const createProjectSkills = async (projectId: number, skillId: number) => {
  await prisma.project_skills.create({
    data: {
      project_id: projectId,
      skill_id: skillId
    }
  });
};

const createProjectProcess = async (projectId: number, processId: number) => {
  await prisma.project_process.create({
    data: {
      project_id: projectId,
      process_id: processId
    }
  });
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // リクエストボディをデストラクチャリング
    const {
      id,
      start_date,
      end_date,
      hp_posting_flag,
      client,
      contract,
      working_postal_code,
      working_address,
      working_start_time,
      working_end_time,
      holiday,
      project_title,
      description,
      price,
      skills,
      process
    } = request.body;

    const skillIds = skills?.map((skillItem: SkillParameterType) => skillItem?.id) ?? null;
    const processIds = process?.map((processItem: ParameterType) => processItem?.id) ?? null;

    // project_title が存在しない場合はエラーをスロー
    if (!project_title) {
      throw new Error('パラメーターが不足しています');
    }

    // id が存在する場合は更新を行う
    if (id) {
      await prisma.project.update({
        where: { id: Number(id) },
        data: {
          hp_posting_flag,
          start_date,
          end_date,
          client: {
            connect: client ? { id: client.id } : undefined
          },
          contract: {
            connect: contract ? { id: contract.id } : undefined
          },
          working_postal_code,
          working_address,
          working_start_time,
          working_end_time,
          holiday,
          project_title,
          description,
          price
        }
      });

      // 既存データを削除
      await Promise.all([
        await prisma.project_skills.deleteMany({
          where: {
            project_id: Number(id)
          }
        }),
        await prisma.project_process.deleteMany({
          where: {
            project_id: Number(id)
          }
        })
      ]);

      await Promise.all([
        await Promise.all(skillIds.map((skillId: number) => createProjectSkills(Number(id), skillId))),
        await Promise.all(processIds.map((processId: number) => createProjectProcess(Number(id), processId)))
      ]);

      // 更新結果を必要に応じて処理
    } else {
      // id が存在しない場合は新規挿入を行う
      const res = await prisma.project.create({
        data: {
          hp_posting_flag,
          start_date,
          end_date,
          client: {
            connect: client ? { id: client.id } : undefined
          },
          contract: {
            connect: contract ? { id: contract.id } : undefined
          },
          working_postal_code,
          working_address,
          working_start_time,
          working_end_time,
          holiday,
          project_title,
          description,
          price
        }
      });

      await Promise.all([
        await Promise.all(skillIds.map((skillId: number) => createProjectSkills(Number(res.id), skillId))),
        await Promise.all(processIds.map((processId: number) => createProjectProcess(Number(res.id), processId)))
      ]);

      // 挿入結果を必要に応じて処理
    }

    // データを取得
    const projects = await projectsPromise;

    // レスポンスを送信
    return response.status(200).json({ projects });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
